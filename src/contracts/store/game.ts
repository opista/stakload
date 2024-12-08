type Filters = {
  developers?: string[];
  gameModes?: string[];
  genres?: string[];
  playerPerspectives?: string[];
  publishers?: string[];
};

export type GameState = {
  selectedGame: string | null;
  selectedFilters: Filters;
};
