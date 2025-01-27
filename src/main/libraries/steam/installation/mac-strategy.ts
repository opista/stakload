import path from "path";

import { BaseSteamInstallationStrategy } from "./base-strategy";

export class MacSteamInstallationStrategy extends BaseSteamInstallationStrategy {
  applicationPath: string | undefined;

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) return this.applicationPath;
    const homeDir = process.env.HOME;
    const applicationPath = path.join(homeDir!, "Library/Application Support/Steam");
    this.applicationPath = applicationPath;
    return applicationPath;
  }
}
