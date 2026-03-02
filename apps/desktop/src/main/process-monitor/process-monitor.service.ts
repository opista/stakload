import { Injectable } from "@nestjs/common";

import { Logger } from "../logging/logging.service";
import { MacProcessMonitor } from "./strategies/mac.strategy";
import { WindowsProcessMonitor } from "./strategies/windows.strategy";
import { ProcessMonitorStrategy } from "./types";

@Injectable()
export class ProcessMonitorService {
  constructor(
    private readonly logger: Logger,
    private readonly macProcessMonitor: MacProcessMonitor,
    private readonly windowsProcessMonitor: WindowsProcessMonitor,
  ) {
    this.logger.setContext(this.constructor.name);
  }

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
