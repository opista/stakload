import fs from "fs/promises";
import path from "path";
import { Service } from "typedi";
import vdf from "vdf";

import { LoggerService } from "../../../../logger/logger.service";
import { mapAppManifestToGameInstallationDetails } from "../mappers/map-app-manifest-to-installed-game-data";
import {
  InstalledGameData,
  InstalledGamesStrategy,
  SteamAppManifest,
  SteamAppStateFlags,
  SteamLibraryFolders,
} from "../types";

@Service()
export abstract class BaseInstalledGamesStrategy implements InstalledGamesStrategy {
  abstract applicationPath: string | undefined;

  abstract getApplicationPath(): Promise<string>;

  constructor(protected readonly logger: LoggerService) {}

  async getLibraryFolders(): Promise<string[]> {
    const steamPath = await this.getApplicationPath();
    const libraryFoldersPath = path.join(steamPath, "steamapps", "libraryfolders.vdf");

    try {
      const content = await fs.readFile(libraryFoldersPath, "utf-8");
      const parsed: SteamLibraryFolders = vdf.parse(content);
      return Object.values(parsed.libraryfolders).map((folder) => folder.path);
    } catch (err) {
      this.logger.error("Failed to parse Steam library folders", err);
      return [steamPath];
    }
  }

  protected async parseManifestFile(manifestPath: string): Promise<SteamAppManifest | null> {
    try {
      const content = await fs.readFile(manifestPath, "utf-8");
      const manifest = vdf.parse(content);
      const state = manifest.AppState;

      const isInstalled = Number(state.StateFlags) === SteamAppStateFlags.Installed;
      if (!isInstalled) return null;

      return {
        gameId: state.appid,
        installLocation: path.join(path.dirname(manifestPath), "common", state.installdir),
        installedAt: new Date(state.LastUpdated * 1000),
        lastUpdated: new Date(state.LastUpdated * 1000),
      };
    } catch (err) {
      this.logger.error(`Failed to parse manifest file: ${manifestPath}`, err);
      return null;
    }
  }

  async getInstalledGames(): Promise<InstalledGameData[]> {
    const libraries = await this.getLibraryFolders();

    const libraryManifests = await Promise.all(
      libraries.map(async (libraryPath) => {
        const manifestPath = path.join(libraryPath, "steamapps");

        try {
          const files = await fs.readdir(manifestPath);
          const manifestPromises = files
            .filter((file) => file.startsWith("appmanifest_") && file.endsWith(".acf"))
            .map((file) => this.parseManifestFile(path.join(manifestPath, file)));

          const manifests = await Promise.all(manifestPromises);
          return manifests.filter((manifest): manifest is SteamAppManifest => manifest !== null);
        } catch (err) {
          this.logger.error(`Failed to read library path: ${libraryPath}`, err);
          return [];
        }
      }),
    );

    return libraryManifests.flat().map(mapAppManifestToGameInstallationDetails);
  }
}
