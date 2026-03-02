import path from "path";

import { Injectable } from "@nestjs/common";

import { Logger } from "../../../../logging/logging.service";
import { BaseInstalledGamesStrategy } from "./base.strategy";

@Injectable()
export class WindowsInstalledGamesStrategy extends BaseInstalledGamesStrategy {
  applicationPath: string | undefined;

  constructor(logger: Logger) {
    super(logger);
    this.logger.setContext(this.constructor.name);
  }

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) return Promise.resolve(this.applicationPath);
    const storagePath = path.join(process.env.ProgramData!, "GOG.com", "Galaxy", "storage");
    this.applicationPath = storagePath;
    this.logger.debug("Determined Windows GOG installation path", {
      storagePath,
    });
    return Promise.resolve(storagePath);
  }
}
