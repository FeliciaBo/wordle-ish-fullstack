import type { HighscoreFilters } from "../types/highscoreFilters.js";

interface HighscoreQuery {
  length?: number;
  unique?: boolean;
}

function buildHighscoreQuery(filters: HighscoreFilters): HighscoreQuery {
  const query: HighscoreQuery = {};

  if (filters.length !== undefined) {
    query.length = filters.length;
  }

  if (filters.unique !== undefined) {
    query.unique = filters.unique;
  }

  return query;
}

export default buildHighscoreQuery;