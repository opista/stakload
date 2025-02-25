import { Library } from "@contracts/database/games";
import { Service } from "typedi";

import { GameStore } from "../game/game.store";
import { LoggerService } from "../logger/logger.service";
import { ProcessMonitorService } from "../process-monitor/process-monitor.service";
import { ProcessMonitorStrategy } from "../process-monitor/types";
import { WindowService } from "../window/window.service";
import { LibraryClientRegistryService } from "./library-client-registry/library-client-registry.service";
import { LaunchResult, LibraryClientService } from "./types";

const POLLING_INTERVAL = 2000;
const MAX_POLLING_TIME = 60000;

@Service()
export class GameLifecycleService {
  private processMonitor: ProcessMonitorStrategy;

  constructor(
    private readonly gameStore: GameStore,
    private readonly libraryClientRegistryService: LibraryClientRegistryService,
    private readonly logger: LoggerService,
    private readonly processMonitorService: ProcessMonitorService,
    private readonly windowService: WindowService,
  ) {
    this.processMonitor = this.processMonitorService.getStrategy();
  }

  private getLauncher(library: Library): LibraryClientService {
    this.logger.debug("Getting launcher for library", { library });
    return this.libraryClientRegistryService.getLibrary(library);
  }

  private watchGameProcess(pid: number, gameName: string) {
    this.logger.debug("Setting up game process watch", { pid, gameName });
    this.processMonitor.watchProcess(pid, () => {
      this.logger.info("Game process terminated, restoring window", { pid, gameName });
      this.windowService.restore();
      this.windowService.focus();
    });
  }

  async launchGame(id: string): Promise<LaunchResult> {
    this.logger.debug("Processing game launch request", { id });

    const game = await this.gameStore.findGameById(id);
    if (!game) {
      this.logger.warn("Game not found for launch", { id });
      return { success: false, error: "Game not found" };
    }

    try {
      this.logger.info("Launching game", { id, name: game.name, library: game.library });
      await this.getLauncher(game.library).launch(game);

      if (!game.installationDetails?.installLocation) {
        this.logger.error("Game launch failed - game doesn't have installation data", { id, name: game.name });
        return {
          error: "Game installation details not found",
          success: false,
        };
      }

      const pid = await this.processMonitor.waitForProcess(game.installationDetails?.installLocation, {
        maxPollingTime: MAX_POLLING_TIME,
        pollingInterval: POLLING_INTERVAL,
      });

      if (!pid) {
        this.logger.error("Game launch failed - process not found", { id, name: game.name });
        return {
          error: "Game process not found after 60 seconds. The game may have failed to launch.",
          success: false,
        };
      }

      this.logger.info("Game launched successfully", { id, name: game.name, pid });
      this.windowService.minimize();
      this.watchGameProcess(pid, game.name);
      return { success: true };
    } catch (error) {
      this.logger.error("Game launch failed", error, { id, name: game.name });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async installGame(id: string) {
    this.logger.debug("Processing game install request", { id });

    const game = await this.gameStore.findGameById(id);
    if (!game) {
      this.logger.warn("Game not found for install", { id });
      return;
    }

    try {
      this.logger.info("Installing game", { id, name: game.name, library: game.library });
      await this.getLauncher(game.library).install(game);
      this.logger.info("Game installation initiated", { id, name: game.name });
    } catch (error) {
      this.logger.error("Game installation failed", error, { id, name: game.name });
      throw error;
    }
  }

  async uninstallGame(id: string) {
    this.logger.debug("Processing game uninstall request", { id });

    const game = await this.gameStore.findGameById(id);
    if (!game) {
      this.logger.warn("Game not found for uninstall", { id });
      return;
    }

    try {
      this.logger.info("Uninstalling game", { id, name: game.name, library: game.library });
      await this.getLauncher(game.library).uninstall(game);
      this.logger.info("Game uninstallation initiated", { id, name: game.name });
    } catch (error) {
      this.logger.error("Game uninstallation failed", error, { id, name: game.name });
      throw error;
    }
  }
}
