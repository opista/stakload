import { Injectable } from "@nestjs/common";

import { Logger } from "../../../logging/logging.service";
import { MacInstalledGamesStrategy } from "./strategies/mac.strategy";
import { WindowsInstalledGamesStrategy } from "./strategies/windows.strategy";
import { InstalledGamesStrategy } from "./types";

@Injectable()
export class InstalledGamesRegistryService {
  constructor(
    private readonly logger: Logger,
    private readonly macInstalledGamesStrategy: MacInstalledGamesStrategy,
    private readonly windowsInstalledGamesStrategy: WindowsInstalledGamesStrategy,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  getStrategy(): InstalledGamesStrategy {
    switch (process.platform) {
      case "darwin": {
        return this.macInstalledGamesStrategy;
      }
      case "win32": {
        return this.windowsInstalledGamesStrategy;
      }
      default: {
        throw new Error("Unsupported platform");
      }
    }
  }
}
