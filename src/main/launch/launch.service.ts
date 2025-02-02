import { GameStoreModel, Library, LikeLibrary } from "@contracts/database/games";
import { Service } from "typedi";

import { GameStore } from "../game/game.store";
import { EpicGameStoreLauncher } from "../libraries/epic-games-store/epic-game-store-launcher";
import { SteamLauncher } from "../libraries/steam/steam-launcher";
import { createProcessMonitorStrategy } from "../process-monitor/create-process-monitor-strategy";
import { ProcessMonitorStrategy } from "../process-monitor/types";
import { WindowService } from "../window/window.service";
import { LauncherActions, LaunchResult } from "./types";

const POLLING_INTERVAL = 2000; // 2 seconds
const MAX_POLLING_TIME = 60000; // 1 minute

@Service()
export class LaunchService {
  private libraries: Partial<Record<LikeLibrary, LauncherActions>>;
  private processMonitor: ProcessMonitorStrategy;

  constructor(
    private readonly gameStore: GameStore,
    private readonly windowService: WindowService,
  ) {
    this.processMonitor = createProcessMonitorStrategy();

    this.libraries = {
      [Library.Steam]: new SteamLauncher(),
      [Library.EpicGameStore]: new EpicGameStoreLauncher(),
    };
  }

  private getLauncher(library: LikeLibrary): LauncherActions {
    const launcher = this.libraries[library];
    if (!launcher) {
      throw new Error(`Unsupported game library: ${library}`);
    }
    return launcher;
  }

  private async pollForGameProcess(game: GameStoreModel): Promise<number | null> {
    const startTime = Date.now();

    while (Date.now() - startTime < MAX_POLLING_TIME) {
      const pid = await this.processMonitor.findProcessByInstallPath(game.installationDetails?.installLocation || "");

      if (pid) {
        return pid;
      }

      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
    }

    return null;
  }

  private watchGameProcess(pid: number) {
    this.processMonitor.watchProcess(pid, () => {
      this.windowService.restore();
      this.windowService.focus();
    });
  }

  async launchGame(id: string): Promise<LaunchResult> {
    const game = await this.gameStore.findGameById(id);
    if (!game) return { success: false, error: "Game not found" };

    try {
      await this.getLauncher(game.library).launch(game);

      const pid = await this.pollForGameProcess(game);

      if (!pid) {
        return {
          success: false,
          error: "Game process not found after 60 seconds. The game may have failed to launch.",
        };
      }

      this.windowService.minimize();
      this.watchGameProcess(pid);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async installGame(id: string) {
    const game = await this.gameStore.findGameById(id);
    if (!game) return;

    return this.getLauncher(game.library).install(game);
  }

  async uninstallGame(id: string) {
    const game = await this.gameStore.findGameById(id);
    if (!game) return;

    return this.getLauncher(game.library).uninstall(game);
  }
}
