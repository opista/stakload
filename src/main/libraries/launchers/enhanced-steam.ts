import { GameStoreModel } from "@contracts/database/games";
import { shell } from "electron";

import { MacProcessMonitor } from "../process-monitor/mac-process-monitor";

const STEAM_LAUNCHER_BASE_URL = "steam://";
const POLLING_INTERVAL = 2000; // 2 seconds
const MAX_POLLING_TIME = 60000; // 1 minute
const processMonitor = new MacProcessMonitor();

export class EnhancedSteamLauncher {
  private gameExitHandler?: () => void;

  onGameExit(handler: () => void) {
    this.gameExitHandler = handler;
  }

  private async pollForGameProcess(game: GameStoreModel): Promise<number | null> {
    const startTime = Date.now();

    while (Date.now() - startTime < MAX_POLLING_TIME) {
      const pid = await processMonitor.findProcessByInstallPath(game.installationDetails?.installLocation || "");

      if (pid) {
        return pid;
      }

      await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
    }

    return null;
  }

  async launchGame(game: GameStoreModel): Promise<{ error?: string; success: boolean }> {
    try {
      // Launch the game
      await shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}run/${game.gameId}`);

      // Poll for the game process
      const pid = await this.pollForGameProcess(game);

      if (!pid) {
        return {
          success: false,
          error: "Game process not found after 60 seconds. The game may have failed to launch.",
        };
      }

      // Watch the process for exit
      processMonitor.watchProcess(pid, () => {
        this.gameExitHandler?.();
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
