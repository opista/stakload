import { Injectable } from "@nestjs/common";
import { checkRegistry } from "@util/check-registry";
import path from "path";
import Registry from "winreg";

import { Logger } from "../../../../logging/logging.service";

import { BaseInstalledGamesStrategy } from "./base.strategy";

@Injectable()
export class WindowsInstalledGamesStrategy extends BaseInstalledGamesStrategy {
  applicationPath: string | undefined;

  constructor(protected readonly logger: Logger) {
    super(logger);
    this.logger.setContext(this.constructor.name);
  }

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) {
      this.logger.debug("Using cached Windows application path", {
        applicationPath: this.applicationPath,
      });
      return this.applicationPath;
    }
    try {
      const result = await checkRegistry({
        hive: Registry.HKLM,
        key: "\\SOFTWARE\\WOW6432Node\\Epic Games\\EpicGamesLauncher",
        name: "AppDataPath",
      });
      if (result) {
        const parentPath = path.join(result, "..", "..");
        this.applicationPath = parentPath;
        this.logger.debug("Determined Windows installed games application path", {
          applicationPath: parentPath,
        });
        return parentPath;
      }
    } catch (error: unknown) {
      this.logger.error("Failed to get Epic Games Launcher app data path from registry", { error });
    }
    this.logger.error("Epic Games Store installation not found");
    throw new Error("Epic Games Store installation not found");
  }
}
