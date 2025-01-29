import path from "path";

import { BaseInstallationStrategy } from "./base-strategy";

export class MacInstallationStrategy extends BaseInstallationStrategy {
  applicationPath: string | undefined;

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) return this.applicationPath;

    const homeDir = process.env.HOME;
    const applicationPath = path.join(homeDir!, "Library/Application Support/Epic");
    this.applicationPath = applicationPath;
    return applicationPath;
  }
}
