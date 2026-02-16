import { ConsoleLogger, Injectable } from "@nestjs/common";
import path from "path";

import { BaseInstalledGamesStrategy } from "./base.strategy";

@Injectable()
export class MacInstalledGamesStrategy extends BaseInstalledGamesStrategy {
  applicationPath: string | undefined;

  constructor(protected readonly logger: ConsoleLogger) {
    super(logger);
    this.logger.setContext(this.constructor.name);
  }

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) {
      this.logger.debug("Using cached Mac Battle.net path", {
        applicationPath: this.applicationPath,
      });
      return Promise.resolve(this.applicationPath);
    }

    const homeDir = process.env.HOME;
    const applicationPath = path.join(homeDir!, "Library/Application Support/Battle.net");
    this.applicationPath = applicationPath;
    this.logger.log("Determined Mac Battle.net path", { applicationPath });
    return Promise.resolve(applicationPath);
  }
}
