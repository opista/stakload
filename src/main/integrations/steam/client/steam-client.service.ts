import { GameStoreModel } from "@contracts/database/games";
import { shell } from "electron";
import { Service } from "typedi";

import { LibraryClientService } from "../../../game-lifecycle/types";
import { LoggerService } from "../../../logger/logger.service";

const STEAM_LAUNCHER_BASE_URL = "steam://";

@Service()
export class SteamClientService implements LibraryClientService {
  constructor(private readonly logger: LoggerService) {}

  async install(game: GameStoreModel): Promise<void> {
    this.logger.info("Initiating Steam installation", { gameId: game.gameId });
    try {
      await shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}install/${game.gameId}`);
      this.logger.debug("Steam installation initiated successfully", { gameId: game.gameId });
    } catch (error) {
      this.logger.error("Failed to initiate Steam installation", error, { gameId: game.gameId });
      throw error;
    }
  }

  async launch(game: GameStoreModel): Promise<void> {
    this.logger.info("Launching game via Steam", { gameId: game.gameId });
    try {
      await shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}run/${game.gameId}`);
      this.logger.debug("Game launched successfully via Steam", { gameId: game.gameId });
    } catch (error) {
      this.logger.error("Failed to launch game via Steam", error, { gameId: game.gameId });
      throw error;
    }
  }

  async uninstall(game: GameStoreModel): Promise<void> {
    this.logger.info("Initiating Steam uninstallation", { gameId: game.gameId });
    try {
      await shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}uninstall/${game.gameId}`);
      this.logger.debug("Steam uninstallation initiated successfully", { gameId: game.gameId });
    } catch (error) {
      this.logger.error("Failed to initiate Steam uninstallation", error, { gameId: game.gameId });
      throw error;
    }
  }
}
