import { useState, useEffect } from "react";
import "./Home.scss";

const API_BASE = "http://localhost:5080/api";

function getStatus(feedbackItem) {
  return feedbackItem?.split(": ")[1] || "";
}

function formatTime(timeMs = 0) {
  return (timeMs / 1000).toFixed(2);
}

function Home() {
  const [length, setLength] = useState(5);
  const [allowRepeats, setAllowRepeats] = useState(false);

  const [gameId, setGameId] = useState("");
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const [result, setResult] = useState(null);
  const [correctWord, setCorrectWord] = useState("");

  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);

  const [error, setError] = useState("");

  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!gameStarted || gameWon || !startTime) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [gameStarted, gameWon, startTime]);

  function resetToStartView() {
    setGameId("");
    setGuess("");
    setGuesses([]);
    setGameStarted(false);
    setGameWon(false);
    setResult(null);
    setCorrectWord("");
    setPlayerName("");
    setScoreSaved(false);
    setError("");
    setStartTime(null);
    setElapsedTime(0);
  }

  async function startGame() {
    try {
      setError("");
      setGuess("");
      setGuesses([]);
      setGameWon(false);
      setResult(null);
      setCorrectWord("");
      setPlayerName("");
      setScoreSaved(false);

      const unique = !allowRepeats;

      const response = await fetch(
        `${API_BASE}/word?length=${length}&unique=${unique}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not start game");
      }

      setGameId(data.gameId);
      setGameStarted(true);
      setStartTime(Date.now());
      setElapsedTime(0);
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

      const response = await fetch(`${API_BASE}/guess`, {
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

      setGuesses((prev) => [...prev, newGuessEntry]);
      setGuess("");

      if (data.isCorrect) {
        setGameWon(true);
        setResult({
          guessesCount: data.guessesCount,
          timeMs: data.timeMs,
        });
        setCorrectWord(trimmedGuess);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSaveScore(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE}/highscores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          name: playerName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save score");
      }

      setScoreSaved(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Wordle Game</h1>

      {error && <p>Error: {error}</p>}

      {!gameStarted && (
        <div>
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
        </div>
      )}

      {gameStarted && !gameWon && (
        <div>
          <p>Time: {formatTime(elapsedTime)} seconds</p>

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

      {gameStarted && gameWon && (
        <div>
          <p>You won!</p>

          {result && (
            <div>
              <p>Guesses: {result.guessesCount}</p>
              <p>Final time: {formatTime(result.timeMs)} seconds</p>
            </div>
          )}

          {correctWord && (
            <div className="row">
              {correctWord.split("").map((letter, index) => (
                <div key={index} className="tile correct">
                  {letter}
                </div>
              ))}
            </div>
          )}

          {!scoreSaved ? (
            <form onSubmit={handleSaveScore}>
              <label>
                Your name:
                <input
                  type="text"
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                />
              </label>

              <button type="submit">Save score</button>
            </form>
          ) : (
            <p>Score saved!</p>
          )}

          <button className="start-button" onClick={resetToStartView}>
            Start new game
          </button>
          
        </div>
      )}
    </div>
  );
}

export default Home;