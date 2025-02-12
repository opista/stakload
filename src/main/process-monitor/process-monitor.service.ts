import { Service } from "typedi";

import { MacProcessMonitor } from "./strategies/mac.strategy";
import { WindowsProcessMonitor } from "./strategies/windows.strategy";
import { ProcessMonitorStrategy } from "./types";

@Service()
export class ProcessMonitorService {
  constructor(
    private readonly macProcessMonitor: MacProcessMonitor,
    private readonly windowsProcessMonitor: WindowsProcessMonitor,
  ) {}

  getStrategy(): ProcessMonitorStrategy {
    switch (process.platform) {
      case "darwin":
        return this.macProcessMonitor;
      case "win32":
        return this.windowsProcessMonitor;
      default:
        throw new Error("Unsupported platform");
    }
  }
}
