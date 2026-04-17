import type { FormEvent } from "react";
import type { GameResult } from "./types";

type WinViewProps = {
  result: GameResult | null;
  correctWord: string;
  playerName: string;
  scoreSaved: boolean;
  formatTime: (timeMs?: number) => string;
  onPlayerNameChange: (value: string) => void;
  onSaveScore: (event: FormEvent<HTMLFormElement>) => void;
  onStartNewGame: () => void;
};

function WinView({
  result,
  correctWord,
  playerName,
  scoreSaved,
  formatTime,
  onPlayerNameChange,
  onSaveScore,
  onStartNewGame,
}: WinViewProps) {
  return (
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
        <form onSubmit={onSaveScore}>
          <label>
            Your name:
            <input
              type="text"
              value={playerName}
              onChange={(event) => onPlayerNameChange(event.target.value)}
            />
          </label>

          <button type="submit">Save score</button>
        </form>
      ) : (
        <p>Score saved!</p>
      )}

      <button className="start-button" onClick={onStartNewGame}>
        Start new game
      </button>
    </div>
  );
}

export default WinView;