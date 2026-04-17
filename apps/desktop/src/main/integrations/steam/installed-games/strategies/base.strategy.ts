import { Injectable } from "@nestjs/common";

import { Logger } from "../../../../logging/logging.service";
import { getSteamLibraryFolders, parseSteamManifestFile, readSteamInstalledGames } from "../read-steam-installed-games";
import { InstalledGameData, InstalledGamesStrategy, SteamAppManifest } from "../types";

@Injectable()
export abstract class BaseInstalledGamesStrategy implements InstalledGamesStrategy {
  abstract applicationPath: string | undefined;

  constructor(protected readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  abstract getApplicationPath(): Promise<string>;

  async getInstalledGames(): Promise<InstalledGameData[]> {
    const steamPath = await this.getApplicationPath();
    try {
      return await readSteamInstalledGames(steamPath);
    } catch (err) {
      this.logger.error("Failed to read installed Steam games", err);
      return [];
    }
  }

  async getLibraryFolders(): Promise<string[]> {
    const steamPath = await this.getApplicationPath();
    try {
      return await getSteamLibraryFolders(steamPath);
    } catch (err) {
      this.logger.error("Failed to parse Steam library folders", err);
      return [steamPath];
    }
  }

  protected async parseManifestFile(manifestPath: string): Promise<SteamAppManifest | null> {
    try {
      return await parseSteamManifestFile(manifestPath);
    } catch (err) {
      this.logger.error(`Failed to parse manifest file: ${manifestPath}`, err);
      return null;
    }
  }
}
