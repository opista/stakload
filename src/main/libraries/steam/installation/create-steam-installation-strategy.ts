import { MacSteamInstallationStrategy } from "./mac-strategy";
import { SteamInstallationStrategy } from "./types";
import { WindowsSteamInstallationStrategy } from "./windows-strategy";

export function createSteamInstallationStrategy(): SteamInstallationStrategy {
  switch (process.platform) {
    case "win32":
      return new WindowsSteamInstallationStrategy();
    case "darwin":
      return new MacSteamInstallationStrategy();
    default:
      throw new Error("Unsupported platform");
  }
}
