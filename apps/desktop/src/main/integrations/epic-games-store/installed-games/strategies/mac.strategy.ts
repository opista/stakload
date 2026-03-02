import path from "path";

import { Injectable } from "@nestjs/common";

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
    if (this.applicationPath) {
      this.logger.debug("Using cached Mac application path", {
        applicationPath: this.applicationPath,
      });
      return this.applicationPath;
    }
    const homeDir = process.env.HOME;
    const applicationPath = path.join(homeDir!, "Library/Application Support/Epic");
    this.applicationPath = applicationPath;
    this.logger.log("Determined Mac installed games application path", {
      applicationPath,
    });
    return applicationPath;
  }
}
