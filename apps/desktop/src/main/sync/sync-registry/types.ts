import { Library } from "@stakload/contracts/database/games";
import { GameStoreModel } from "@stakload/contracts/database/games";

export interface SyncService {
  addNewGames: () => Promise<number>;
  authenticate: (data?: unknown) => Promise<void>;
  getGameMetadata: (game: GameStoreModel) => Promise<GameStoreModel | null>;
  isIntegrationValid: () => Promise<boolean>;
  library: Library;
  updateInstalledGames: () => Promise<void>;
}
