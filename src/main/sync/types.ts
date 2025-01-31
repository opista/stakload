import { GameStoreModel, LikeLibrary } from "@contracts/database/games";

export interface FailureHistoryEntry {
  action: "library" | "install" | "metadata";
  code: "AUTHENTICATION_ERROR" | "UNKNOWN_ERROR" | "UNSUPPORTED_LIBRARY";
  gameName?: string;
  library?: LikeLibrary;
}

export interface LibraryActions {
  addNewGames: () => Promise<number>;
  getGameMetadata: (game: GameStoreModel) => Promise<GameStoreModel | null>;
  isIntegrationValid: () => Promise<boolean>;
  updateInstalledGames: () => Promise<void>;
}
