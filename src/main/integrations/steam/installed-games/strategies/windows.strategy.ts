import { checkRegistry } from "@util/check-registry";
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
        key: "\\SOFTWARE\\WOW6432Node\\Valve\\Steam",
        name: "InstallPath",
      });
      if (result) {
        this.applicationPath = result;
        return result;
      }
    } catch (err) {
      console.log("steam", err);
    }

    throw new Error("Steam installation not found");
  }
}
