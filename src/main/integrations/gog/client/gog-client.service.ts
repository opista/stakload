import { GameStoreModel } from "@contracts/database/games";
import { shell } from "electron";
import { Service } from "typedi";

import { LibraryClientService } from "../../../game-lifecycle/types";

const GOG_LAUNCHER_BASE_URL = "goggalaxy://";

@Service()
export class GogClientService implements LibraryClientService {
  async install(game: GameStoreModel): Promise<void> {
    await shell.openExternal(`${GOG_LAUNCHER_BASE_URL}openStore/games/${game.gameId}`);
  }

  async launch(game: GameStoreModel): Promise<void> {
    await shell.openExternal(`${GOG_LAUNCHER_BASE_URL}launchGame/${game.gameId}`);
  }

  async uninstall(game: GameStoreModel): Promise<void> {
    await shell.openExternal(`${GOG_LAUNCHER_BASE_URL}openStore/games/${game.gameId}`);
  }
}
