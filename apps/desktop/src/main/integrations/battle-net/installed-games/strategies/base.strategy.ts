import fs from "fs/promises";
import path from "path";

import { Injectable } from "@nestjs/common";
import protobuf from "protobufjs";

import { mapSortableName } from "@util/map-sortable-name";

import { Logger } from "../../../../logging/logging.service";
import { databaseSchema } from "../../data/database-schema";
import { getBattleNetGameByProductId } from "../../data/games";
import { InstalledGameData, InstalledGamesStrategy } from "../types";

@Injectable()
export abstract class BaseInstalledGamesStrategy implements InstalledGamesStrategy {
  abstract applicationPath: string | undefined;
  constructor(protected readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  abstract getApplicationPath(): Promise<string>;

  async getInstalledGames(): Promise<InstalledGameData[]> {
    try {
      const battleNetPath = await this.getApplicationPath();
      const dbPath = path.join(battleNetPath, "product.db");

      const buffer = await fs.readFile(dbPath);
      const root = protobuf.Root.fromJSON(databaseSchema);
      const decoder = root.lookupType("Database");

      const data = decoder.decode(buffer);
      const message = decoder.toObject(data, {
        defaults: true,
        longs: Number,
      });

      this.logger.debug("Found Battle.net installations", {
        installations: message.productInstall.length,
      });

      return message.productInstall
        .filter((product) => !["agent", "bna"].includes(product.productCode))
        .map((product) => {
          const game = getBattleNetGameByProductId(product.productCode);

          if (!game) {
            this.logger.warn("Game not found for product code", {
              productCode: product.productCode,
            });
            return null;
          }

          return {
            gameId: product.productCode,
            installationDetails: {
              installedAt: new Date(),
              installLocation: product.settings.installPath,
            },
            library: "battle-net",
            name: game?.name,
            sortableName: mapSortableName(game?.name),
          };
        })
        .filter(Boolean);
    } catch (err: unknown) {
      console.error(err);
      this.logger.error("Failed to get installed Battle.net games", { err });
      return [];
    }
  }
}
