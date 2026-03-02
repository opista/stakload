import { Injectable } from "@nestjs/common";
import { shell } from "electron";

import { GameStoreModel } from "@stakload/contracts/database/games";

import { LibraryClientService } from "../../../game-lifecycle/types";
import { Logger } from "../../../logging/logging.service";

const EPIC_LAUNCHER_BASE_URL = "com.epicgames.launcher://";

@Injectable()
export class EpicGamesStoreClientService implements LibraryClientService {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  async install(game: GameStoreModel): Promise<void> {
    const appName = game.libraryMeta?.appName;
    this.logger.log("Installing game via EpicGameStore", { appName });
    try {
      await shell.openExternal(`${EPIC_LAUNCHER_BASE_URL}apps/${appName}?action=install`);
    } catch (error: unknown) {
      this.logger.error("Failed to install game via EpicGameStore", {
        appName,
        error,
      });
      throw error;
    }
  }

  async launch(game: GameStoreModel): Promise<void> {
    const appName = game.libraryMeta?.appName;
    this.logger.log("Launching game via EpicGameStore", { appName });
    try {
      await shell.openExternal(`${EPIC_LAUNCHER_BASE_URL}apps/${appName}?action=launch&silent=true`);
    } catch (error: unknown) {
      this.logger.error("Failed to launch game via EpicGameStore", {
        appName,
        error,
      });
      throw error;
    }
  }

  async uninstall(): Promise<void> {
    this.logger.log("Uninstalling game via EpicGameStore");
    try {
      await shell.openExternal(`${EPIC_LAUNCHER_BASE_URL}store/library`);
    } catch (error: unknown) {
      this.logger.error("Failed to uninstall game via EpicGameStore", {
        error,
      });
      throw error;
    }
  }
}
