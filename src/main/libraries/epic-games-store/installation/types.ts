import { GameInstallationDetails } from "@contracts/database/games";

export interface InstalledGameData {
  appName: string;
  installationDetails: GameInstallationDetails;
}

export interface InstallationStrategy {
  getApplicationPath(): Promise<string>;
  getInstalledGames(): Promise<InstalledGameData[]>;
}
