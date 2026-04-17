import { GameInstallationDetails } from "@stakload/contracts/database/games";

export const STEAM_INSTALLED_GAMES_STRATEGY = Symbol("STEAM_INSTALLED_GAMES_STRATEGY");

export interface SteamLibraryFolder {
  contentid: string;
  label: string;
  path: string;
  time_last_update_verified: string;
  totalsize: string;
  update_clean_bytes_tally: string;
}

export interface SteamLibraryFolders {
  libraryfolders: { [key: string]: SteamLibraryFolder };
}

export interface SteamAppManifest {
  gameId: string;
  installedAt: Date;
  installLocation: string;
  lastUpdated: Date;
}

export enum SteamAppStateFlags {
  Invalid = 0,
  Uninstalled = 1,
  UpdateRequired = 2,
  Installed = 4,
}

export interface InstalledGameData {
  gameId: string;
  installationDetails: GameInstallationDetails;
}

export interface InstalledGamesStrategy {
  getApplicationPath(): Promise<string>;
  getInstalledGames(): Promise<InstalledGameData[]>;
  getLibraryFolders(): Promise<string[]>;
}
