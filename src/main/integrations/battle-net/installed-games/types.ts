import { GameInstallationDetails } from "@contracts/database/games";

export interface BattleNetInstallationData {
  installLocation: string;
  lastPlayed?: number;
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
