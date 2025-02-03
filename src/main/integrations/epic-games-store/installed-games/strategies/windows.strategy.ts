import { checkRegistry } from "@util/check-registry";
import path from "path";
import { Service } from "typedi";
import Registry from "winreg";

import { BaseInstalledGamesStrategy } from "./base.strategy";

@Service()
export class WindowsInstalledGamesStrategy extends BaseInstalledGamesStrategy {
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
