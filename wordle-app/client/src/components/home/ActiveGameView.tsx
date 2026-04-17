import type { FormEvent } from "react";
import GuessHistory from "./GuessHistory";
import type { GuessEntry } from "./types";

type ActiveGameViewProps = {
  elapsedTime: number;
  guess: string;
  guesses: GuessEntry[];
  formatTime: (timeMs?: number) => string;
  getStatus: (feedbackItem: string | undefined) => string;
  onGuessChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function ActiveGameView({
  elapsedTime,
  guess,
  guesses,
  formatTime,
  getStatus,
  onGuessChange,
  onSubmit,
}: ActiveGameViewProps) {
  return (
    <div>
      <p>Time: {formatTime(elapsedTime)} seconds</p>

      <form className="guess-form" onSubmit={onSubmit}>
        <label>
          Your guess:
          <input
            className="guess-input"
            type="text"
            value={guess}
            onChange={(event) => onGuessChange(event.target.value)}
          />
        </label>

        <button type="submit" className="guess-button">
          Guess
        </button>
      </form>

      <GuessHistory guesses={guesses} getStatus={getStatus} />
    </div>
  );
}

export default ActiveGameView;