import path from "path";
import { Service } from "typedi";

import { LoggerService } from "../../../../logger/logger.service";
import { BaseInstalledGamesStrategy } from "./base.strategy";

@Service()
export class MacInstalledGamesStrategy extends BaseInstalledGamesStrategy {
  applicationPath: string | undefined;

  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) {
      this.logger.debug("Using cached Mac Battle.net path", {
        applicationPath: this.applicationPath,
      });
      return this.applicationPath;
    }

    const homeDir = process.env.HOME;
    const applicationPath = path.join(homeDir!, "Library/Application Support/Battle.net");
    this.applicationPath = applicationPath;
    this.logger.info("Determined Mac Battle.net path", { applicationPath });
    return applicationPath;
  }
}
