import { GameStoreModel } from "@contracts/database/games";
import { shell } from "electron";
import { Service } from "typedi";

import { LibraryClientService } from "../../../game-lifecycle/types";
import { LoggerService } from "../../../logger/logger.service";

const BATTLE_NET_LAUNCHER_BASE_URL = "battlenet://";

// TODO: None of this is working, we need to figure out how to install and launch games via Battle.net

@Service()
export class BattleNetClientService implements LibraryClientService {
  constructor(private readonly logger: LoggerService) {}

  async install(game: GameStoreModel): Promise<void> {
    this.logger.info("Initiating Battle.net installation", { gameId: game.gameId });
    try {
      await shell.openExternal(`${BATTLE_NET_LAUNCHER_BASE_URL}install=${game.gameId}`);
      this.logger.debug("Battle.net installation launched successfully", { gameId: game.gameId });
    } catch (error) {
      this.logger.error("Failed to open Battle.net installer", error, { gameId: game.gameId });
      throw error;
    }
  }

  async launch(game: GameStoreModel): Promise<void> {
    this.logger.info("Launching game via Battle.net", { gameId: game.gameId });
    try {
      await shell.openExternal(`${BATTLE_NET_LAUNCHER_BASE_URL}${game.gameId}`);
      this.logger.debug("Game launched successfully via Battle.net", { gameId: game.gameId });
    } catch (error) {
      this.logger.error("Failed to launch game via Battle.net", error, { gameId: game.gameId });
      throw error;
    }
  }

  async uninstall(game: GameStoreModel): Promise<void> {
    this.logger.info("Initiating Battle.net uninstallation", { gameId: game.gameId });
    try {
      await shell.openExternal(`${BATTLE_NET_LAUNCHER_BASE_URL}games`);
      this.logger.debug("Battle.net uninstallation window opened", { gameId: game.gameId });
    } catch (error) {
      this.logger.error("Failed to open Battle.net uninstaller", error, { gameId: game.gameId });
      throw error;
    }
  }
}
