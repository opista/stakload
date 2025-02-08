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
        key: "\\SOFTWARE\\WOW6432Node\\GOG.com\\GalaxyClient",
        name: "ClientInstallPath",
      });
      if (result) {
        const storagePath = path.join(result, "Storage");
        this.applicationPath = storagePath;
        return storagePath;
      }
    } catch (err) {
      console.log("gog", err);
    }

    throw new Error("GOG Galaxy installation not found");
  }
}
