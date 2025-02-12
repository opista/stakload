import { GameStoreModel } from "@contracts/database/games";
import { shell } from "electron";
import { Service } from "typedi";

import { LibraryClientService } from "../../../game-lifecycle/types";
import { LoggerService } from "../../../logger/logger.service";

const GOG_LAUNCHER_BASE_URL = "goggalaxy://";

@Service()
export class GogClientService implements LibraryClientService {
  constructor(private readonly logger: LoggerService) {}

  async install(game: GameStoreModel): Promise<void> {
    this.logger.info("Initiating GOG installation", { gameId: game.gameId });
    try {
      await shell.openExternal(`${GOG_LAUNCHER_BASE_URL}openStore/games/${game.gameId}`);
      this.logger.debug("GOG installation launched successfully", { gameId: game.gameId });
    } catch (error) {
      this.logger.error("Failed to open GOG installer", error, { gameId: game.gameId });
      throw error;
    }
  }

  async launch(game: GameStoreModel): Promise<void> {
    this.logger.info("Launching game via GOG", { gameId: game.gameId });
    try {
      await shell.openExternal(`${GOG_LAUNCHER_BASE_URL}launchGame/${game.gameId}`);
      this.logger.debug("Game launched successfully via GOG", { gameId: game.gameId });
    } catch (error) {
      this.logger.error("Failed to launch game via GOG", error, { gameId: game.gameId });
      throw error;
    }
  }

  async uninstall(game: GameStoreModel): Promise<void> {
    this.logger.info("Initiating GOG uninstallation", { gameId: game.gameId });
    try {
      await shell.openExternal(`${GOG_LAUNCHER_BASE_URL}openStore/games/${game.gameId}`);
      this.logger.debug("GOG uninstallation launched successfully", { gameId: game.gameId });
    } catch (error) {
      this.logger.error("Failed to open GOG uninstaller", error, { gameId: game.gameId });
      throw error;
    }
  }
}
