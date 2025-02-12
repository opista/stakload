import { GameStoreModel, Library } from "@contracts/database/games";
import { Service } from "typedi";

import { GameStore } from "../game/game.store";
import { LoggerService } from "../logger/logger.service";
import { ProcessMonitorService } from "../process-monitor/process-monitor.service";
import { ProcessMonitorStrategy } from "../process-monitor/types";
import { WindowService } from "../window/window.service";
import { LibraryClientRegistryService } from "./library-client-registry/library-client-registry.service";
import { LaunchResult, LibraryClientService } from "./types";

const POLLING_INTERVAL = 2000; // 2 seconds
const MAX_POLLING_TIME = 60000; // 1 minute

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

  private async pollForGameProcess(game: GameStoreModel): Promise<number | null> {
    const startTime = Date.now();
    this.logger.debug("Starting to poll for game process", {
      gameId: game._id,
      installPath: game.installationDetails?.installLocation,
    });

    while (Date.now() - startTime < MAX_POLLING_TIME) {
      const pid = await this.processMonitor.findProcessByInstallPath(game.installationDetails?.installLocation || "");

      if (pid) {
        this.logger.info("Game process found", { gameId: game._id, pid });
        return pid;
      }

      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
    }

    this.logger.warn("Game process not found after timeout", {
      gameId: game._id,
      timeoutMs: MAX_POLLING_TIME,
    });
    return null;
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

      const pid = await this.pollForGameProcess(game);
      if (!pid) {
        this.logger.error("Game launch failed - process not found", { id, name: game.name });
        return {
          success: false,
          error: "Game process not found after 60 seconds. The game may have failed to launch.",
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
