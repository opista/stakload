import path from "path";
import { Service } from "typedi";

import { LoggerService } from "../../../../logger/logger.service";

import { BaseInstalledGamesStrategy } from "./base.strategy";

@Service()
export class MacInstalledGamesStrategy extends BaseInstalledGamesStrategy {
  applicationPath: string | undefined;

  constructor(logger: LoggerService) {
    super(logger);
  }

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) return this.applicationPath;
    const storagePath = path.join("/Users/Shared/GOG.com/Galaxy/Storage");
    this.applicationPath = storagePath;
    this.logger.debug("Determined Mac GOG installation path", { storagePath });
    return storagePath;
  }
}
