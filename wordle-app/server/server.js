import express from "express";
import cors from "cors";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

import chooseWord from "./logic/chooseWord.js";
import feedback from "./logic/feedback.js";

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

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});