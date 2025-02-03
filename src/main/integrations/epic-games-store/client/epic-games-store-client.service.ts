import { GameStoreModel } from "@contracts/database/games";
import { shell } from "electron";
import { Service } from "typedi";

import { LibraryClientService } from "../../../game-lifecycle/types";

const EPIC_LAUNCHER_BASE_URL = "com.epicgames.launcher://";

@Service()
export class EpicGameStoreClientService implements LibraryClientService {
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
