import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

import chooseWord from "./logic/chooseWord.js";
import feedback from "./logic/feedback.js";
import connectToDatabase from "./db/mongodb.js";

import parseHighscoreFilters from "./dist-ts/utils/parseHighscoreFilters.js";
import buildHighscoreQuery from "./dist-ts/utils/buildHighscoreQuery.js";

const app = express();
const PORT = 5080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const words = ["banan", "melon", "kiwi", "citron", "äpple", "päron", "apelsin", "jordgubb", "lime", "is", "i" ];

function getMockWord(length, unique) {
  const mockWords = {
    "5-true": "melon",
    "6-false": "banana",
    "3-true": "bär",
  };

  return mockWords[`${length}-${unique}`] || null;
}

const games = {};

app.use(cors());
app.use(express.json());

app.get("/api/word", async (req, res) => {
  try {
    const length = parseInt(req.query.length, 10) || 5;
    const unique = req.query.unique === "true";

    let word;

    if (process.env.TEST_MODE === "true") {
      word = getMockWord(length, unique);

      if (!word) {
        throw new Error("No mock word found for these settings");
      }
    } else {
      word = chooseWord(words, length, unique);
    }

    const gameId = crypto.randomUUID();

    games[gameId] = {
      secretWord: word.toLowerCase(),
      length,
      unique,
      guesses: [],
      startedAt: Date.now(),
      isFinished: false,
      finishedAt: null,
      scoreSaved: false,
    };

    res.json({ gameId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/guess", (req, res) => {
  try {
    const { gameId, guess } = req.body;
    const normalizedGuess = guess?.trim().toLowerCase();

    if (!gameId || !normalizedGuess) {
      throw new Error("gameId and guess are required");
    }

    const game = games[gameId];

    if (!game) {
      throw new Error("Game not found");
    }

    if (game.isFinished) {
      throw new Error("Game is already finished");
    }

    const feedbackResult = feedback(normalizedGuess, game.secretWord);

    game.guesses.push(normalizedGuess);

    const isCorrect = normalizedGuess === game.secretWord;
    let timeMs = null;

    if (isCorrect) {
      game.isFinished = true;
      game.finishedAt = Date.now();
      timeMs = game.finishedAt - game.startedAt;
    }

    res.json({
      feedback: feedbackResult,
      isCorrect,
      guessesCount: game.guesses.length,
      timeMs,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/highscores", async (req, res) => {
  try {
    const { gameId, name } = req.body;

    if (!gameId || !name?.trim()) {
      throw new Error("gameId and name are required");
    }

    const game = games[gameId];

    if (!game) {
      throw new Error("Game not found");
    }

    if (!game.isFinished || !game.finishedAt) {
      throw new Error("Game is not finished");
    }

    if (game.scoreSaved) {
      throw new Error("Score already saved");
    }

    const score = {
      name: name.trim(),
      timeMs: game.finishedAt - game.startedAt,
      guessesCount: game.guesses.length,
      guesses: game.guesses,
      length: game.length,
      unique: game.unique,
      createdAt: new Date(),
    };

    const db = await connectToDatabase();
    const result = await db.collection("highscores").insertOne(score);

    game.scoreSaved = true;

    res.status(201).json({
      message: "Score saved",
      insertedId: result.insertedId,
      score,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/highscores", async (req, res) => {
  try {
    const filters = parseHighscoreFilters(req.query);
    const query = buildHighscoreQuery(filters);

    const db = await connectToDatabase();

    const highscores = await db
      .collection("highscores")
      .find(query)
      .sort({ timeMs: 1, guessesCount: 1, createdAt: 1 })
      .toArray();

    res.json(highscores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/highscores", async (req, res) => {
  try {
    const filters = parseHighscoreFilters(req.query);
    const query = buildHighscoreQuery(filters);

    const db = await connectToDatabase();

    const highscores = await db
      .collection("highscores")
      .find(query)
      .sort({ timeMs: 1, guessesCount: 1, createdAt: 1 })
      .toArray();

    const viewFilters = {
      length: filters.length ?? "",
      unique:
        filters.unique === true
          ? "true"
          : filters.unique === false
          ? "false"
          : "",
    };

    res.render("highscores", { highscores, filters: viewFilters });
  } catch (error) {
    res.status(500).send(`
      <h1>Could not load highscores</h1>
      <p>${error.message}</p>
    `);
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});