import { CollectionStoreModel } from "@contracts/database/collections";
import { GameFilters, GameStoreModel } from "@contracts/database/games";

export type GameState = {
  collections: CollectionStoreModel[];
  currentCollection?: CollectionStoreModel;
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
