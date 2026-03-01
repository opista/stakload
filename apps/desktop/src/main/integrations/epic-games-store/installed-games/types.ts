import { GameInstallationDetails } from "@stakload/contracts/database/games";

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
