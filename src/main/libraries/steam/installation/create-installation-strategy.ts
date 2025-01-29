import { MacInstallationStrategy } from "./mac-strategy";
import { InstallationStrategy } from "./types";
import { WindowsInstallationStrategy } from "./windows-strategy";

export function createInstallationStrategy(): InstallationStrategy {
  switch (process.platform) {
    case "win32":
      return new WindowsInstallationStrategy();
    case "darwin":
      return new MacInstallationStrategy();
    default:
      throw new Error("Unsupported platform");
  }
}
