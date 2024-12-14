import { GameFilters } from "@contracts/database/games";

export type GameState = {
  selectedCollection: string;
  selectedGame: string | null;
  selectedFilters: GameFilters;
};

export type GameSyncMessage = {
  processing: number;
  total: number;
};
