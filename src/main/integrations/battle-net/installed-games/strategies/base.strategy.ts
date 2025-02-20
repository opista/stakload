import fs from "fs/promises";
import path from "path";
import { Service } from "typedi";

import { LoggerService } from "../../../../logger/logger.service";
import { BattleNetInstallationData, InstalledGameData, InstalledGamesStrategy } from "../types";

@Service()
export abstract class BaseInstalledGamesStrategy implements InstalledGamesStrategy {
  abstract applicationPath: string | undefined;
  abstract getApplicationPath(): Promise<string>;

  constructor(protected readonly logger: LoggerService) {}

  async getInstalledGames(): Promise<InstalledGameData[]> {
    const battleNetPath = await this.getApplicationPath();

    try {
      // Battle.net stores game info in Product.db
      const productDbPath = path.join(battleNetPath, "Product.db");
      const content = await fs.readFile(productDbPath, "utf-8");
      const installations = this.parseProductDb(content);

      this.logger.info("Fetched installed Battle.net games", { productDbPath });

      return installations.map((install) => ({
        gameId: install.productId,
        installationDetails: {
          installLocation: install.installLocation,
          installedAt: install.lastPlayed ? new Date(install.lastPlayed) : new Date(),
        },
      }));
    } catch (error: unknown) {
      this.logger.error("Failed to get installed Battle.net games", { error });
      return [];
    }
  }

  private parseProductDb(content: string): BattleNetInstallationData[] {
    try {
      // Battle.net's Product.db is SQLite, we'll need to parse it
      // This is a placeholder - actual implementation would use better-sqlite3 or similar
      return [];
    } catch (error) {
      this.logger.error("Failed to parse Battle.net Product.db", error);
      return [];
    }
  }
}
