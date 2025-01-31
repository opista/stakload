import { GameStoreModel } from "@contracts/database/games";
import { shell } from "electron";

import { LauncherActions } from "../../launch/types";

const EPIC_LAUNCHER_BASE_URL = "com.epicgames.launcher://";

export class EpicGameStoreLauncher implements LauncherActions {
  async install(game: GameStoreModel): Promise<void> {
    await shell.openExternal(`${EPIC_LAUNCHER_BASE_URL}apps/${game.libraryMeta?.appName}?action=install`);
  }

  async launch(game: GameStoreModel): Promise<void> {
    await shell.openExternal(`${EPIC_LAUNCHER_BASE_URL}apps/${game.libraryMeta?.appName}?action=launch&silent=true`);
  }

  async uninstall(): Promise<void> {
    await shell.openExternal(`${EPIC_LAUNCHER_BASE_URL}store/library`);
  }
}
