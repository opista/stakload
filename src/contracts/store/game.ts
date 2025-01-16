import { GameFilters, GameStoreModel } from "@contracts/database/games";

export type GameState = {
  currentGame?: GameStoreModel;
  games: GameStoreModel[];
  selectedCollection: string;
  selectedFilters: GameFilters;
  selectedGame: string | null;
};

export type GameSyncMessage = {
  processing: number;
  total: number;
};
