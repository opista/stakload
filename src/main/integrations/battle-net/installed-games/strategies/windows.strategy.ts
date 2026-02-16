import { ConsoleLogger, Injectable } from "@nestjs/common";
import path from "path";

import { BaseInstalledGamesStrategy } from "./base.strategy";

@Injectable()
export class WindowsInstalledGamesStrategy extends BaseInstalledGamesStrategy {
  applicationPath: string | undefined;

  constructor(protected readonly logger: ConsoleLogger) {
    super(logger);
    this.logger.setContext(this.constructor.name);
  }

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) return Promise.resolve(this.applicationPath);
    const storagePath = path.join(process.env.ProgramData!, "Battle.net", "Agent");
    this.applicationPath = storagePath;
    this.logger.debug("Determined Windows Battle.net installation path", { storagePath });
    return Promise.resolve(storagePath);
  }
}
