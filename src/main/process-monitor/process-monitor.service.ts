import { Service } from "typedi";

import { MacProcessMonitor } from "./strategies/mac.strategy";
import { WindowsProcessMonitor } from "./strategies/windows.strategy";
import { ProcessMonitorStrategy } from "./types";

@Service()
export class ProcessMonitorService {
  getStrategy(): ProcessMonitorStrategy {
    switch (process.platform) {
      case "win32":
        return new WindowsProcessMonitor();
      case "darwin":
        return new MacProcessMonitor();
      default:
        throw new Error("Unsupported platform");
    }
  }
}
