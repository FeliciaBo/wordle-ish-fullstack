import { useState } from "react";
import "./Home.scss";

function getStatus(feedbackItem) {
  return feedbackItem.split(": ")[1];
}

function formatTime(timeMs) {
  if (timeMs === null || timeMs === undefined) return "";

  const seconds = (timeMs / 1000).toFixed(1);
  return `${seconds} seconds`;
};

function Home() {
  const [length, setLength] = useState(5);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [gameId, setGameId] = useState("");

  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  async function startGame() {
    try {
      setError("");
      setGuess("");
      setGuesses([]);
      setGameWon(false);
      setResult(null);

      const unique = !allowRepeats;

      const response = await fetch(
        `http://localhost:5080/api/word?length=${length}&unique=${unique}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not start game");
      }

      setGameId(data.gameId);
      setGameStarted(true);
    } catch (err) {
      setError(err.message);
      setGameStarted(false);
      setGameId("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const trimmedGuess = guess.trim().toLowerCase();

      const response = await fetch("http://localhost:5080/api/guess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          guess: trimmedGuess,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not submit guess");
      }

      const newGuessEntry = {
        guess: trimmedGuess,
        feedback: data.feedback,
      };

      setGuesses([...guesses, newGuessEntry]);
      setGuess("");

      if (data.isCorrect) {
     setGameWon(true);
     setResult({
     guessesCount: data.guessesCount,
     timeMs: data.timeMs,
  });
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
            className="length-input"
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
            className="checkbox"
            type="checkbox"
            checked={allowRepeats}
            onChange={(event) => setAllowRepeats(event.target.checked)}
          />
        </label>
      </div>

      <button className="start-button" onClick={startGame}>
        Start game
      </button>

      {error && <p>Error: {error}</p>}

      {gameStarted && (
        <div>
          <p>Game started.</p>

          {gameWon ? (
        <div>
         <p>You won!</p>
          {result && (
        <div>
         <p>Guesses: {result.guessesCount}</p>
         <p>Time: {formatTime(result.timeMs)}</p>
       </div>
        )}
      </div>
      ) : (
            <form className="guess-form" onSubmit={handleSubmit}>
              <label>
                Your guess:
                <input
                  className="guess-input"
                  type="text"
                  value={guess}
                  onChange={(event) => setGuess(event.target.value)}
                />
              </label>

              <button type="submit" className="guess-button">
                Guess
              </button>
            </form>
          )}

          <h3>Previous guesses</h3>

          {guesses.length === 0 ? (
            <p>No guesses yet.</p>
          ) : (
            <div>
              {guesses.map((entry, index) => (
                <div key={index} className="row">
                  {entry.guess.split("").map((letter, letterIndex) => {
                    const status = getStatus(entry.feedback[letterIndex]);

                    return (
                      <div key={letterIndex} className={`tile ${status}`}>
                        {letter}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;