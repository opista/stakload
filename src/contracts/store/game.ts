import { GameFilters } from "@contracts/database/games";

export type GameState = {
  selectedGame: string | null;
  selectedFilters: GameFilters;
};

export type GameSyncMessage = {
  processing: number;
  total: number;
};
