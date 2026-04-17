import { useState, useEffect, type FormEvent } from "react";
import "./Home.scss";

import StartGameForm from "../components/home/StartGameForm";
import ActiveGameView from "../components/home/ActiveGameView";
import WinView from "../components/home/WinView";
import type { GuessEntry, GameResult } from "../components/home/types";

import {
  startGameApi,
  submitGuessApi,
  saveScoreApi,
} from "../api/gameApi";

function getStatus(feedbackItem: string | undefined): string {
  return feedbackItem?.split(": ")[1] || "";
}

function formatTime(timeMs: number = 0): string {
  return (timeMs / 1000).toFixed(2);
}

function Home() {
  const [length, setLength] = useState<number>(5);
  const [allowRepeats, setAllowRepeats] = useState<boolean>(false);

  const [gameId, setGameId] = useState<string>("");
  const [guess, setGuess] = useState<string>("");
  const [guesses, setGuesses] = useState<GuessEntry[]>([]);

  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const [result, setResult] = useState<GameResult | null>(null);
  const [correctWord, setCorrectWord] = useState<string>("");

  const [playerName, setPlayerName] = useState<string>("");
  const [scoreSaved, setScoreSaved] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    if (!gameStarted || gameWon || !startTime) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [gameStarted, gameWon, startTime]);

  function resetToStartView(): void {
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

  async function startGame(): Promise<void> {
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

      const data = await startGameApi(length, unique);

      setGameId(data.gameId);
      setGameStarted(true);
      setStartTime(Date.now());
      setElapsedTime(0);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not start game";
      setError(message);
      setGameStarted(false);
      setGameId("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");

    try {
      const trimmedGuess = guess.trim().toLowerCase();

      const data = await submitGuessApi(gameId, trimmedGuess);

      const newGuessEntry: GuessEntry = {
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
      const message =
        err instanceof Error ? err.message : "Could not submit guess";
      setError(message);
    }
  }

  async function handleSaveScore(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    setError("");

    try {
      await saveScoreApi(gameId, playerName);
      setScoreSaved(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save score";
      setError(message);
    }
  }

  return (
    <div>
      <h1>Wordle Game</h1>

      {error && <p>Error: {error}</p>}

      {!gameStarted && (
        <StartGameForm
          length={length}
          allowRepeats={allowRepeats}
          onLengthChange={setLength}
          onAllowRepeatsChange={setAllowRepeats}
          onStartGame={startGame}
        />
      )}

      {gameStarted && !gameWon && (
        <ActiveGameView
          elapsedTime={elapsedTime}
          guess={guess}
          guesses={guesses}
          formatTime={formatTime}
          getStatus={getStatus}
          onGuessChange={setGuess}
          onSubmit={handleSubmit}
        />
      )}

      {gameStarted && gameWon && (
        <WinView
          result={result}
          correctWord={correctWord}
          playerName={playerName}
          scoreSaved={scoreSaved}
          formatTime={formatTime}
          onPlayerNameChange={setPlayerName}
          onSaveScore={handleSaveScore}
          onStartNewGame={resetToStartView}
        />
      )}
    </div>
  );
}

export default Home;