import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cachedWords = null;

async function loadWords() {
  if (cachedWords) {
    return cachedWords;
  }

  const filePath = path.join(__dirname, "words_alpha.txt");
  const fileContent = await fs.readFile(filePath, "utf-8");

  cachedWords = fileContent
    .split("\n")
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean)
    .filter((word) => /^[a-z]+$/.test(word));

  return cachedWords;
}

export default loadWords;