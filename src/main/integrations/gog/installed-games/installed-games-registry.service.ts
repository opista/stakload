import { Service } from "typedi";

import { MacInstalledGamesStrategy } from "./strategies/mac.strategy";
import { WindowsInstalledGamesStrategy } from "./strategies/windows.strategy";
import { InstalledGamesStrategy } from "./types";

@Service()
export class InstalledGamesRegistryService {
  constructor(
    private readonly macInstalledGamesStrategy: MacInstalledGamesStrategy,
    private readonly windowsInstalledGamesStrategy: WindowsInstalledGamesStrategy,
  ) {}

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
