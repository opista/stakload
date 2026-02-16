import { GameStoreModel } from "@contracts/database/games";
import { ConsoleLogger, Injectable } from "@nestjs/common";
import { shell } from "electron";

import { LibraryClientService } from "../../../game-lifecycle/types";

const GOG_LAUNCHER_BASE_URL = "goggalaxy://";

@Injectable()
export class GogClientService implements LibraryClientService {
  constructor(private readonly logger: ConsoleLogger) {
    this.logger.setContext(this.constructor.name);
  }

  async install(game: GameStoreModel): Promise<void> {
    this.logger.log("Initiating GOG installation", { gameId: game.gameId });
    try {
      await shell.openExternal(`${GOG_LAUNCHER_BASE_URL}openStore/games/${game.gameId}`);
      this.logger.debug("GOG installation launched successfully", { gameId: game.gameId });
    } catch (error) {
      this.logger.error("Failed to open GOG installer", error, { gameId: game.gameId });
      throw error;
    }
  }

  async launch(game: GameStoreModel): Promise<void> {
    this.logger.log("Launching game via GOG", { gameId: game.gameId });
    try {
      await shell.openExternal(`${GOG_LAUNCHER_BASE_URL}launchGame/${game.gameId}`);
      this.logger.debug("Game launched successfully via GOG", { gameId: game.gameId });
    } catch (error) {
      this.logger.error("Failed to launch game via GOG", error, { gameId: game.gameId });
      throw error;
    }
  }

  async uninstall(game: GameStoreModel): Promise<void> {
    this.logger.log("Initiating GOG uninstallation", { gameId: game.gameId });
    try {
      await shell.openExternal(`${GOG_LAUNCHER_BASE_URL}openStore/games/${game.gameId}`);
      this.logger.debug("GOG uninstallation launched successfully", { gameId: game.gameId });
    } catch (error) {
      this.logger.error("Failed to open GOG uninstaller", error, { gameId: game.gameId });
      throw error;
    }
  }
}
