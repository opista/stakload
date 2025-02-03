import { GameStoreModel } from "@contracts/database/games";
import { shell } from "electron";
import { Service } from "typedi";

import { LibraryClientService } from "../../../game-lifecycle/types";

const STEAM_LAUNCHER_BASE_URL = "steam://";

@Service()
export class SteamClientService implements LibraryClientService {
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
