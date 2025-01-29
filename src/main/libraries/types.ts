import { GameStoreModel } from "@contracts/database/games";

export interface LibraryActions {
  addNewGames: () => Promise<number>;
  getGameMetadata: (game: GameStoreModel) => Promise<GameStoreModel | null>;
  isIntegrationValid: () => Promise<boolean>;
  updateInstalledGames: () => Promise<void>;
}
