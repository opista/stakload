import { IpcController, IpcHandle, IpcOn } from "@electron-ipc-bridge/core";
import { Controller } from "@nestjs/common";

import type { GameFilters } from "@stakload/contracts/database/games";

import { CollectionService } from "../collection/collection.service";
import { GameLifecycleService } from "../game-lifecycle/game-lifecycle.service";
import { Logger } from "../logging/logging.service";
import { GameService } from "./game.service";

@IpcController()
@Controller()
export class GameController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly gameLifecycleService: GameLifecycleService,
    private readonly gameService: GameService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @IpcHandle()
  async archiveGameById(id: string) {
    this.logger.log("Handling IPC message", { id });
    try {
      return await this.gameService.archiveGame(id);
    } catch (error) {
      this.logger.error("Failed to archive game", error, { id });
      throw error;
    }
  }

  @IpcHandle()
  async deleteGameById(id: string) {
    this.logger.log("Handling IPC message", { id });
    try {
      return await this.gameService.deleteGame(id);
    } catch (error) {
      this.logger.error("Failed to delete game", error, { id });
      throw error;
    }
  }

  @IpcHandle()
  async getFilteredGames(filters: GameFilters) {
    this.logger.log("Handling IPC message", { filters });
    return this.gameService.getFilteredGames(filters);
  }

  @IpcHandle()
  async getGameById(id: string) {
    this.logger.log("Handling IPC message", { id });
    return this.gameService.getGameById(id);
  }

  @IpcHandle()
  async getGameFilters() {
    this.logger.log("Handling IPC message");
    return this.gameService.getGameFilters();
  }

  @IpcHandle()
  async getGamesByCollection(collectionId: string) {
    this.logger.log("Handling IPC message", { collectionId });
    const collection = await this.collectionService.getCollectionById(collectionId);
    if (!collection) return [];
    return this.gameService.getFilteredGames(collection.filters);
  }

  @IpcHandle()
  async getGamesList() {
    this.logger.log("Handling IPC message");
    return this.gameService.getGamesList();
  }

  @IpcHandle()
  async getNewGames() {
    this.logger.log("Handling IPC message");
    return this.gameService.getNewGames();
  }

  @IpcHandle()
  async getProtondbTier(id: string) {
    this.logger.log("Handling IPC message", { id });
    return this.gameService.getProtondbTier(id);
  }

  @IpcHandle()
  async getQuickLaunchGames() {
    this.logger.log("Handling IPC message");
    return this.gameService.getQuickLaunchGames();
  }

  @IpcOn()
  async installGame(id: string) {
    this.logger.log("Handling IPC message", { id });
    return this.gameLifecycleService.installGame(id);
  }

  @IpcOn()
  async launchGame(id: string) {
    this.logger.log("Handling IPC message", { id });
    return this.gameLifecycleService.launchGame(id);
  }

  @IpcHandle()
  async toggleFavouriteGame(id: string) {
    this.logger.log("Handling IPC message", { id });
    try {
      return await this.gameService.toggleFavouriteGame(id);
    } catch (error) {
      this.logger.error("Failed to toggle game favourite status", error, {
        id,
      });
      throw error;
    }
  }

  @IpcHandle()
  async toggleQuickLaunchGame(id: string) {
    this.logger.log("Handling IPC message", { id });
    try {
      return await this.gameService.toggleQuickLaunchGame(id);
    } catch (error) {
      this.logger.error("Failed to toggle game quick launch status", error, {
        id,
      });
      throw error;
    }
  }

  @IpcOn()
  async uninstallGame(id: string) {
    this.logger.log("Handling IPC message", { id });
    return this.gameLifecycleService.uninstallGame(id);
  }
}
