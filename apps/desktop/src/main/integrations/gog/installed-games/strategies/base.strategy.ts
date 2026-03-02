import path from "path";

import { Injectable } from "@nestjs/common";
import Database from "better-sqlite3";

import { Logger } from "../../../../logging/logging.service";
import { mapAppManifestToGameInstallationDetails } from "../mappers/map-app-manifest-to-installed-game-data";
import { GogInstalledBaseProduct, InstalledGameData, InstalledGamesStrategy } from "../types";

@Injectable()
export abstract class BaseInstalledGamesStrategy implements InstalledGamesStrategy {
  abstract applicationPath: string | undefined;

  constructor(protected readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  abstract getApplicationPath(): Promise<string>;

  async getInstalledGames(): Promise<InstalledGameData[]> {
    const gogPath = await this.getApplicationPath();
    const dbPath = path.join(gogPath, "galaxy-2.0.db");

    try {
      const db = new Database(dbPath, { readonly: true });

      const installedGames = db
        .prepare<unknown[], GogInstalledBaseProduct>(
          `SELECT installationDate, installationPath, productId FROM InstalledBaseProducts`,
        )
        .all();

      db.close();
      this.logger.debug("Fetched installed GOG games from database", {
        count: installedGames.length,
        dbPath,
      });
      return installedGames.map(mapAppManifestToGameInstallationDetails);
    } catch (err) {
      this.logger.error("Failed to read GOG Galaxy database", err, { dbPath });
      return [];
    }
  }
}
