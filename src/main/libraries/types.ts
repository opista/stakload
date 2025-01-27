import { GameInstallationDetails, GameStoreModel } from "@contracts/database/games";

export interface LibraryActions {
  getGameMetadata: (game: GameStoreModel) => Promise<GameStoreModel | null>;
  getInstalledGames: () => Promise<GameInstallationDetails[]>;
  getNewGames: () => Promise<Partial<GameStoreModel>[]>;
  isIntegrationValid: () => Promise<boolean>;
}
