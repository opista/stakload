import { GameFilters } from "@contracts/database/games";

export type GameState = {
  selectedCollection: string;
  selectedFilters: GameFilters;
  selectedGame: string | null;
};

export type GameSyncMessage = {
  processing: number;
  total: number;
};
