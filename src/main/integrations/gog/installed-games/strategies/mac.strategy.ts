import path from "path";
import { Service } from "typedi";

import { BaseInstalledGamesStrategy } from "./base.strategy";

@Service()
export class MacInstalledGamesStrategy extends BaseInstalledGamesStrategy {
  applicationPath: string | undefined;

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) return this.applicationPath;

    const storagePath = path.join("/Users/Shared/GOG.com/Galaxy/Storage");
    this.applicationPath = storagePath;
    return storagePath;
  }
}
