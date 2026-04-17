export type GuessEntry = {
  guess: string;
  feedback: string[];
};

export type GameResult = {
  guessesCount: number;
  timeMs: number;
};