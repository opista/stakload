import { GameStoreModel } from "@contracts/database/games";
import { shell } from "electron";

import { LauncherActions } from "../../launch/types";

const STEAM_LAUNCHER_BASE_URL = "steam://";

export class SteamLauncher implements LauncherActions {
  async install(game: GameStoreModel): Promise<void> {
    await shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}install/${game.gameId}`);
  }

  async launch(game: GameStoreModel): Promise<void> {
    await shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}run/${game.gameId}`);
  }

  async uninstall(game: GameStoreModel): Promise<void> {
    await shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}uninstall/${game.gameId}`);
  }
}
