import { useState } from "react";
import feedback from "../utils/feedback";

function Home() {
  const [length, setLength] = useState(5);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [secretWord, setSecretWord] = useState("");

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [error, setError] = useState("");

  async function startGame() {
    
    try {
      setError("");
      setGuess("");
      setGuesses([]);

      setGameWon(false);

      const unique = !allowRepeats;

      const response = await fetch(
        `http://localhost:5080/api/word?length=${length}&unique=${unique}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not start game");
      }

      setSecretWord(data.word.toLowerCase());
      setGameStarted(true);
    } catch (err) {
      setError(err.message);
      setGameStarted(false);
      setSecretWord("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const trimmedGuess = guess.trim().toLowerCase();
      const feedbackResult = feedback(trimmedGuess, secretWord);

      const newGuessEntry = {
        guess: trimmedGuess,
        feedback: feedbackResult,
      };

      setGuesses([...guesses, newGuessEntry]);
      setGuess("");

      if (trimmedGuess === secretWord) {
        setGameWon(true);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Start Game</h2>

      <div>
        <label>
          Word length:
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
          Include repeated letters:
          <input
            type="checkbox"
            checked={allowRepeats}
            onChange={(event) => setAllowRepeats(event.target.checked)}
          />
        </label>
      </div>

      <button onClick={startGame}>Start game</button>

      {error && <p>Error: {error}</p>}

      {gameStarted && (
        <div>
          <p>Game started.</p>
          <p>Secret word from server: {secretWord}</p>

          {gameWon ? (
            <p>You won!</p>
          ) : (
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
          )}

          <h3>Previous guesses</h3>

          {guesses.length === 0 ? (
            <p>No guesses yet.</p>
          ) : (
            <ul>
              {guesses.map((entry, index) => (
                <li key={index}>
                  <strong>{entry.guess}</strong>
                  <ul>
                    {entry.feedback.map((item, feedbackIndex) => (
                      <li key={feedbackIndex}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;