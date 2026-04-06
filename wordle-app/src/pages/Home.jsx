import { useState } from "react";

function Home() {
  const [word, setWord] = useState("");
  const [error, setError] = useState("");

  async function getWord() {
    try {
      setError("");

      const response = await fetch(
        "http://localhost:5080/api/word?length=5&unique=true"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setWord(data.word);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Start Game</h2>

      <button onClick={getWord}>Generate word</button>

      {word && <p>Correct word: {word}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default Home;