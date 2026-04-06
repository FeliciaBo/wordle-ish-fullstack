import { useState } from "react";

function Home() {
  const [length, setLength] = useState(5);
  const [unique, setUnique] = useState(true);
  const [secretWord, setSecretWord] = useState("");

  const [guess, setGuess] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState("");

  async function startGame() {
    try {
      setError("");
      setGuess("");

      const response = await fetch(
        `http://localhost:5080/api/word?length=${length}&unique=${unique}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not start game");
      }

      setSecretWord(data.word);
      setGameStarted(true);
    } catch (err) {
      setError(err.message);
      setGameStarted(false);
      setSecretWord("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("User guess:", guess);
  }

  return (
    <div>
      <h2>Wordle game</h2>

      <div>
        <label>
          Select word length:
          <input
            type="number"
            min="1"
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
        
          <input
            type="checkbox"
            checked={unique}
            onChange={(event) => setUnique(event.target.checked)}
          />
          No repeated letters
        </label>
      </div>

      <button onClick={startGame}>Start game</button>

      {error && <p>Error: {error}</p>}

      {gameStarted && (
        <div>
          <p>Game started.</p>
          <p>Correct word:  {secretWord}</p>

          <form onSubmit={handleSubmit}>
            <label>
              Your guess:
              <input
                type="text"
                value={guess}
                onChange={(event) => setGuess(event.target.value)}
              />
            </label>

            <button type="submit">Guess</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;