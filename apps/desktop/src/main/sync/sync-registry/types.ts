import { Library } from "@stakload/contracts/database/games";
import { GameStoreModel } from "@stakload/contracts/database/games";

export interface SyncService {
  addNewGames: () => Promise<number>;
  authenticate: (data?: unknown) => Promise<void>;
  isIntegrationValid: () => Promise<boolean>;
  library: Library;
  resolveMetadataGameId?: (game: GameStoreModel) => Promise<string | null>;
  updateInstalledGames: () => Promise<void>;
}
