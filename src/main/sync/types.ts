import { GameStoreModel, Library } from "@contracts/database/games";

export interface FailureHistoryEntry {
  action: "library" | "install" | "metadata";
  code: "AUTHENTICATION_ERROR" | "UNKNOWN_ERROR" | "UNSUPPORTED_LIBRARY";
  gameName?: string;
  library?: Library;
}

export interface LibraryActions {
  addNewGames: () => Promise<number>;
  getGameMetadata: (game: GameStoreModel) => Promise<GameStoreModel | null>;
  isIntegrationValid: () => Promise<boolean>;
  library: Library;
  updateInstalledGames: () => Promise<void>;
}
