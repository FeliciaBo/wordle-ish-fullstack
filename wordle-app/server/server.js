import express from "express";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";
import chooseWord from "./logic/chooseWord.js";

const app = express();
const PORT = 5080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const words = ["banan", "melon", "kiwi", "citron", "äpple", "päron", "apelsin", "jordgubb"];
  
app.use(cors());

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/api/word", (req, res) => {

  // exempel på inställningar för ord 
  // - retunerar just nu "melon" eller "päron"
  
  try {
    const length = parseInt(req.query.length) || 5;
    const unique = req.query.unique === "true";

    const word = chooseWord(words, length, unique);

    res.json({ word });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});