import { GameInstallationDetails } from "@contracts/database/games";

export interface GogInstalledBaseProduct {
  installationDate: string;
  installationPath: string;
  productId: number;
}

export interface InstalledGameData {
  gameId: string;
  installationDetails: GameInstallationDetails;
}

export interface InstalledGamesStrategy {
  getApplicationPath(): Promise<string>;
  getInstalledGames(): Promise<InstalledGameData[]>;
}
