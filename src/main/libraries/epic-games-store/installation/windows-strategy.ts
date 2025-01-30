import path from "path";
import Registry from "winreg";

import { checkRegistry } from "../../../util/check-registry";
import { BaseInstallationStrategy } from "./base-strategy";

export class WindowsInstallationStrategy extends BaseInstallationStrategy {
  applicationPath: string | undefined;

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) return this.applicationPath;

    try {
      const result = await checkRegistry({
        hive: Registry.HKLM,
        key: "\\SOFTWARE\\WOW6432Node\\Epic Games\\EpicGamesLauncher",
        name: "AppDataPath",
      });
      if (result) {
        const parentPath = path.join(result, "..", "..");
        this.applicationPath = parentPath;
        return parentPath;
      }
    } catch (err) {
      console.log("epic", err);
    }

    throw new Error("Epic Games Store installation not found");
  }
}
