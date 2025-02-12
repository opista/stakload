import Database from "better-sqlite3";
import path from "path";
import { Service } from "typedi";

import { LoggerService } from "../../../../logger/logger.service";
import { mapAppManifestToGameInstallationDetails } from "../mappers/map-app-manifest-to-installed-game-data";
import { GogInstalledBaseProduct, InstalledGameData, InstalledGamesStrategy } from "../types";

@Service()
export abstract class BaseInstalledGamesStrategy implements InstalledGamesStrategy {
  abstract applicationPath: string | undefined;

  abstract getApplicationPath(): Promise<string>;

  constructor(protected readonly logger: LoggerService) {}

  async getInstalledGames(): Promise<InstalledGameData[]> {
    const gogPath = await this.getApplicationPath();
    const dbPath = path.join(gogPath, "galaxy-2.0.db");

    try {
      const db = new Database(dbPath, { readonly: true });

      const installedGames = db
        .prepare<
          unknown[],
          GogInstalledBaseProduct
        >(`SELECT installationDate, installationPath, productId FROM InstalledBaseProducts`)
        .all();

      db.close();
      this.logger.debug("Fetched installed GOG games from database", { dbPath, count: installedGames.length });
      return installedGames.map(mapAppManifestToGameInstallationDetails);
    } catch (err) {
      this.logger.error("Failed to read GOG Galaxy database", err, { dbPath });
      return [];
    }
  }
}
