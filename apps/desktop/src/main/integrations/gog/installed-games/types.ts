import { GameInstallationDetails } from "@stakload/contracts/database/games";

export const GOG_INSTALLED_GAMES_STRATEGY = Symbol("GOG_INSTALLED_GAMES_STRATEGY");

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
