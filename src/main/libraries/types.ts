import { GameStoreModel } from "@contracts/database/games";

import { InstalledGameData } from "./steam/installation/types";

export interface LibraryActions {
  getGameMetadata: (game: GameStoreModel) => Promise<GameStoreModel | null>;
  getInstalledGames: () => Promise<InstalledGameData[]>;
  getNewGames: () => Promise<Partial<GameStoreModel>[]>;
  isIntegrationValid: () => Promise<boolean>;
}
