import { GameInstallationDetails } from "@stakload/contracts/database/games";

export const EPIC_GAMES_STORE_INSTALLED_GAMES_STRATEGY = Symbol("EPIC_GAMES_STORE_INSTALLED_GAMES_STRATEGY");

export interface EpicInstallationData {
  AppName: string;
  InstallLocation: string;
  NamespaceId: string;
}

export interface InstalledGameData {
  appName: string;
  installationDetails: GameInstallationDetails;
}

export interface InstalledGamesStrategy {
  getApplicationPath(): Promise<string>;
  getInstalledGames(): Promise<InstalledGameData[]>;
}
