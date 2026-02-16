import { ConsoleLogger, Injectable } from "@nestjs/common";
import path from "path";

import { BaseInstalledGamesStrategy } from "./base.strategy";

@Injectable()
export class MacInstalledGamesStrategy extends BaseInstalledGamesStrategy {
  applicationPath: string | undefined;

  constructor(logger: ConsoleLogger) {
    super(logger);
    this.logger.setContext(this.constructor.name);
  }

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) return Promise.resolve(this.applicationPath);
    const storagePath = path.join("/Users/Shared/GOG.com/Galaxy/Storage");
    this.applicationPath = storagePath;
    this.logger.debug("Determined Mac GOG installation path", { storagePath });
    return Promise.resolve(storagePath);
  }
}
