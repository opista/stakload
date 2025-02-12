import fs from "fs/promises";
import path from "path";
import { Service } from "typedi";

import { LoggerService } from "../../../../logger/logger.service";
import { EpicInstallationData, InstalledGameData, InstalledGamesStrategy } from "../types";

@Service()
export abstract class BaseInstalledGamesStrategy implements InstalledGamesStrategy {
  abstract applicationPath: string | undefined;

  abstract getApplicationPath(): Promise<string>;

  constructor(protected readonly logger: LoggerService) {}

  async getInstalledGames(): Promise<InstalledGameData[]> {
    const epicPath = await this.getApplicationPath();
    const manifestPath = path.join(epicPath, "UnrealEngineLauncher", "LauncherInstalled.dat");

    try {
      const content = await fs.readFile(manifestPath, "utf-8");
      const parsed = JSON.parse(content) as { InstallationList: EpicInstallationData[] };
      this.logger.info("Fetched installed Epic games", { manifestPath });
      return parsed.InstallationList.map((install) => ({
        appName: install.AppName,
        installationDetails: {
          installLocation: install.InstallLocation,
          installedAt: new Date(),
        },
      }));
    } catch (error: unknown) {
      this.logger.error("Failed to get installed Epic games", { error, manifestPath });
      return [];
    }
  }
}
