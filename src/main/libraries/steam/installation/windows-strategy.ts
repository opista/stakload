import Registry from "winreg";

import { BaseSteamInstallationStrategy } from "./base-strategy";

export class WindowsSteamInstallationStrategy extends BaseSteamInstallationStrategy {
  applicationPath: string | undefined;

  async getApplicationPath(): Promise<string> {
    if (this.applicationPath) return this.applicationPath;

    const reg = new Registry({
      hive: Registry.HKLM,
      key: "\\SOFTWARE\\WOW6432Node\\Valve\\Steam",
    });

    return new Promise((resolve, reject) => {
      reg.get("InstallPath", (err, item) => {
        if (err) reject(err);
        if (!item?.value) reject(new Error("Steam installation not found"));
        this.applicationPath = item.value;
        resolve(item.value);
      });
    });
  }
}
