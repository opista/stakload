import { Injectable } from "@nestjs/common";
import Registry from "winreg";

import { checkRegistry } from "@util/check-registry";

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
    if (this.applicationPath) return this.applicationPath;
    try {
      const result = await checkRegistry({
        hive: Registry.HKLM,
        key: "\\SOFTWARE\\WOW6432Node\\Valve\\Steam",
        name: "InstallPath",
      });
      if (result) {
        this.applicationPath = result;
        this.logger.debug("Determined Windows Steam installation path", {
          applicationPath: result,
        });
        return result;
      }
    } catch (err) {
      this.logger.error("Error checking registry for Steam installation", err);
    }
    throw new Error("Steam installation not found");
  }
}
