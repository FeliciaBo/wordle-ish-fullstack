import type { GuessEntry } from "./types";

type GuessHistoryProps = {
  guesses: GuessEntry[];
  getStatus: (feedbackItem: string | undefined) => string;
};

function GuessHistory({ guesses, getStatus }: GuessHistoryProps) {
  return (
    <>
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
    </>
  );
}

export default GuessHistory;