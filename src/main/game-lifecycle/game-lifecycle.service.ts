import { Library } from "@contracts/database/games";
import { NOTIFICATION_KEYS } from "@contracts/store/notification";
import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { GameStore } from "../game/game.store";
import { Logger } from "../logging/logging.service";
import { NotificationService } from "../notification/notification.service";
import { ProcessMonitorService } from "../process-monitor/process-monitor.service";
import { ProcessMonitorStrategy } from "../process-monitor/types";
import { WindowService } from "../window/window.service";

import { LibraryClientRegistryService } from "./library-client-registry/library-client-registry.service";
import { LaunchResult, LibraryClientService } from "./types";

const POLLING_INTERVAL = 2000;
const MAX_POLLING_TIME = 60000;

@Injectable()
export class GameLifecycleService {
  private processMonitor: ProcessMonitorStrategy;

  constructor(
    @Inject(forwardRef(() => GameStore)) private readonly gameStore: GameStore,
    private readonly libraryClientRegistryService: LibraryClientRegistryService,
    private readonly logger: Logger,
    private readonly notificationService: NotificationService,
    private readonly processMonitorService: ProcessMonitorService,
    private readonly windowService: WindowService,
  ) {
    this.logger.setContext(this.constructor.name);
    this.processMonitor = this.processMonitorService.getStrategy();
  }

  private getLauncher(library: Library): LibraryClientService {
    this.logger.debug("Getting launcher for library", { library });
    return this.libraryClientRegistryService.getLibrary(library);
  }

  private watchGameProcess(pid: number, gameName: string) {
    this.logger.debug("Setting up game process watch", { gameName, pid });
    this.processMonitor.watchProcess(pid, () => {
      this.logger.log("Game process terminated, restoring window", { gameName, pid });
      this.windowService.restore();
      this.windowService.focus();
    });
  }

  async installGame(id: string) {
    this.logger.debug("Processing game install request", { id });

    const game = await this.gameStore.findGameById(id);
    if (!game) {
      this.logger.warn("Game not found for install", { id });
      return;
    }

    try {
      this.logger.log("Installing game", { id, library: game.library, name: game.name });
      await this.getLauncher(game.library).install(game);
      this.logger.log("Game installation initiated", { id, name: game.name });
    } catch (error) {
      this.logger.error("Game installation failed", error, { id, name: game.name });
      this.notificationService.error({
        message: NOTIFICATION_KEYS.GAME_INSTALLATION_FAILED_MESSAGE,
        title: NOTIFICATION_KEYS.GAME_INSTALLATION_FAILED_TITLE,
      });
      throw error;
    }
  }

  async launchGame(id: string): Promise<LaunchResult> {
    this.logger.debug("Processing game launch request", { id });

    const game = await this.gameStore.findGameById(id);
    if (!game) {
      this.logger.warn("Game not found for launch", { id });
      return { error: "Game not found", success: false };
    }

    try {
      this.logger.log("Launching game", { id, library: game.library, name: game.name });
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

      this.logger.log("Game launched successfully", { id, name: game.name, pid });
      this.windowService.minimize();
      this.watchGameProcess(pid, game.name);
      return { success: true };
    } catch (error) {
      this.logger.error("Game launch failed", error, { id, name: game.name });
      this.notificationService.error({
        message: NOTIFICATION_KEYS.GAME_LAUNCH_FAILED_MESSAGE,
        title: NOTIFICATION_KEYS.GAME_LAUNCH_FAILED_TITLE,
      });
      return {
        error: error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
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
      this.logger.log("Uninstalling game", { id, library: game.library, name: game.name });
      await this.getLauncher(game.library).uninstall(game);
      this.logger.log("Game uninstallation initiated", { id, name: game.name });
    } catch (error) {
      this.logger.error("Game uninstallation failed", error, { id, name: game.name });
      this.notificationService.error({
        message: NOTIFICATION_KEYS.GAME_UNINSTALLATION_FAILED_MESSAGE,
        title: NOTIFICATION_KEYS.GAME_UNINSTALLATION_FAILED_TITLE,
      });
      throw error;
    }
  }
}
