import path from "path";
import { Service } from "typedi";

import { BaseInstalledGamesStrategy } from "./base.strategy";

@Service()
export class MacInstalledGamesStrategy extends BaseInstalledGamesStrategy {
  applicationPath: string | undefined;

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) return this.applicationPath;

    const homeDir = process.env.HOME;
    const applicationPath = path.join(homeDir!, "Library/Application Support/Epic");
    this.applicationPath = applicationPath;
    return applicationPath;
  }
}
