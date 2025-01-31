import { MacProcessMonitor } from "./mac-strategy";
import { ProcessMonitorStrategy } from "./types";
import { WindowsProcessMonitor } from "./windows-strategy";

export function createProcessMonitorStrategy(): ProcessMonitorStrategy {
  switch (process.platform) {
    case "win32":
      return new WindowsProcessMonitor();
    case "darwin":
      return new MacProcessMonitor();
    default:
      throw new Error("Unsupported platform");
  }
}
