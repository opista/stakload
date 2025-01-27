import { GameInstallationDetails } from "@contracts/database/games";

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
  installLocation: string;
  installedAt: Date;
  lastUpdated: Date;
  size: number;
}

export enum SteamAppStateFlags {
  Invalid = 0,
  Uninstalled = 1,
  UpdateRequired = 2,
  Installed = 4,
}

export interface SteamInstallationStrategy {
  getApplicationPath(): Promise<string>;
  getInstalledGames(): Promise<GameInstallationDetails[]>;
  getLibraryFolders(): Promise<string[]>;
}
