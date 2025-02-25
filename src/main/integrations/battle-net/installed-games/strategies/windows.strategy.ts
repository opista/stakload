import path from "path";
import { Service } from "typedi";

import { LoggerService } from "../../../../logger/logger.service";
import { BaseInstalledGamesStrategy } from "./base.strategy";

@Service()
export class WindowsInstalledGamesStrategy extends BaseInstalledGamesStrategy {
  applicationPath: string | undefined;

  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) return this.applicationPath;
    const storagePath = path.join(process.env.ProgramData!, "Battle.net", "Agent");
    this.applicationPath = storagePath;
    this.logger.debug("Determined Windows Battle.net installation path", { storagePath });
    return storagePath;
  }
}
