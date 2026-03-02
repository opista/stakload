import fs from "fs/promises";
import path from "path";

import { Injectable } from "@nestjs/common";

import { Logger } from "../../../../logging/logging.service";
import { EpicInstallationData, InstalledGameData, InstalledGamesStrategy } from "../types";

@Injectable()
export abstract class BaseInstalledGamesStrategy implements InstalledGamesStrategy {
  abstract applicationPath: string | undefined;

  constructor(protected readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  abstract getApplicationPath(): Promise<string>;

  async getInstalledGames(): Promise<InstalledGameData[]> {
    const epicPath = await this.getApplicationPath();
    const manifestPath = path.join(epicPath, "UnrealEngineLauncher", "LauncherInstalled.dat");

    try {
      const content = await fs.readFile(manifestPath, "utf-8");
      const parsed = JSON.parse(content) as {
        InstallationList: EpicInstallationData[];
      };
      this.logger.log("Fetched installed Epic games", { manifestPath });
      return parsed.InstallationList.map((install) => ({
        appName: install.AppName,
        installationDetails: {
          installedAt: new Date(),
          installLocation: install.InstallLocation,
        },
      }));
    } catch (error: unknown) {
      this.logger.error("Failed to get installed Epic games", {
        error,
        manifestPath,
      });
      return [];
    }
  }
}
