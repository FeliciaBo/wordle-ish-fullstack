import "dotenv/config";
import express from "express";
import cors from "cors";

import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

import chooseWord from "./logic/chooseWord.js";
import feedback from "./logic/feedback.js";
import connectToDatabase from "./db/mongodb.js";

const app = express();
const PORT = 5080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const words = ["banan", "melon", "kiwi", "citron", "äpple", "päron", "apelsin", "jordgubb", "lime", "is", "i" ];

const games = {};

app.use(cors());
app.use(express.json());

app.get("/api/word", (req, res) => {
  try {
    const length = parseInt(req.query.length) || 5;
    const unique = req.query.unique === "true";

    const word = chooseWord(words, length, unique);
    const gameId = crypto.randomUUID();

    games[gameId] = {
      secretWord: word.toLowerCase(),
      length,
      unique,
      guesses: [],
      startedAt: Date.now(),
      isFinished: false,
      finishedAt: null,
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

    res.status(201).json({
      message: "Score saved",
      insertedId: result.insertedId,
      score,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/highscores", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const highscores = await db
      .collection("highscores")
      .find({})
      .sort({ timeMs: 1, guessesCount: 1, createdAt: 1 })
      .toArray();

    res.render("highscores", { highscores });
  } catch (error) {
    res.status(500).send(`
      <h1>Could not load highscores</h1>
      <p>${error.message}</p>
    `);
  }
});

app.get("/highscores", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const highscores = await db
      .collection("highscores")
      .find({})
      .sort({ timeMs: 1, guessesCount: 1, createdAt: 1 })
      .toArray();

    const html = renderHighscoresPage(highscores);
    res.send(html);
  } catch (error) {
    res.status(500).send(`
      <h1>Could not load highscores</h1>
      <p>${error.message}</p>
    `);
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../client/dist")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});