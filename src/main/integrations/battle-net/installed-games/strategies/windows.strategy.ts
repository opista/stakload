import { checkRegistry } from "@util/check-registry";
import path from "path";
import { Service } from "typedi";
import Registry from "winreg";

import { LoggerService } from "../../../../logger/logger.service";
import { BaseInstalledGamesStrategy } from "./base.strategy";

@Service()
export class WindowsInstalledGamesStrategy extends BaseInstalledGamesStrategy {
  applicationPath: string | undefined;

  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) {
      this.logger.debug("Using cached Windows Battle.net path", {
        applicationPath: this.applicationPath,
      });
      return this.applicationPath;
    }

    try {
      const result = await checkRegistry({
        hive: Registry.HKLM,
        key: "\\SOFTWARE\\WOW6432Node\\Blizzard Entertainment\\Battle.net\\Launch Options",
        name: "LastPath",
      });

      if (result) {
        const parentPath = path.dirname(result);
        this.applicationPath = parentPath;
        this.logger.debug("Determined Windows Battle.net path", {
          applicationPath: parentPath,
        });
        return parentPath;
      }
    } catch (error: unknown) {
      this.logger.error("Failed to get Battle.net path from registry", { error });
    }

    this.logger.error("Battle.net installation not found");
    throw new Error("Battle.net installation not found");
  }
}
