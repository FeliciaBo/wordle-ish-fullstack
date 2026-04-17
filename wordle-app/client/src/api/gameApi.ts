const API_BASE = "http://localhost:5080/api";

export async function startGameApi(length: number, unique: boolean) {
  const response = await fetch(
    `${API_BASE}/word?length=${length}&unique=${unique}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not start game");
  }

  return data;
}

export async function submitGuessApi(gameId: string, guess: string) {
  const response = await fetch(`${API_BASE}/guess`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameId, guess }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not submit guess");
  }

  return data;
}

export async function saveScoreApi(gameId: string, name: string) {
  const response = await fetch(`${API_BASE}/highscores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ gameId, name }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not save score");
  }

  return data;
}