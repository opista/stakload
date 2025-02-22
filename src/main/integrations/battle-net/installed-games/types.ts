import { GameInstallationDetails } from "@contracts/database/games";

export interface BattleNetInstallationData {
  // e.g., "wow", "d3", "ow"
  installLocation: string;
  lastPlayed?: number;
  // Battle.net's unique game identifier
  productId: string;
  uid: string;
}

export interface InstalledGameData {
  gameId: string;
  installationDetails: GameInstallationDetails;
  name: string;
}

export interface InstalledGamesStrategy {
  getApplicationPath(): Promise<string>;
  getInstalledGames(): Promise<InstalledGameData[]>;
}
