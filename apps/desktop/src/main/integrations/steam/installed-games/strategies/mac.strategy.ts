import { Injectable } from "@nestjs/common";
import path from "path";

import { Logger } from "../../../../logging/logging.service";

import { BaseInstalledGamesStrategy } from "./base.strategy";

@Injectable()
export class MacInstalledGamesStrategy extends BaseInstalledGamesStrategy {
  applicationPath: string | undefined;

  constructor(protected readonly logger: Logger) {
    super(logger);
    this.logger.setContext(this.constructor.name);
  }

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) return this.applicationPath;
    const homeDir = process.env.HOME;
    const applicationPath = path.join(homeDir!, "Library/Application Support/Steam");
    this.applicationPath = applicationPath;
    this.logger.debug("Determined Mac Steam installation path", { applicationPath });
    return applicationPath;
  }
}
