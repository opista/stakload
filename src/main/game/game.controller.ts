import type { GameFilters } from "@contracts/database/games";
import { IpcHandle, IpcOn } from "@util/ipc/ipc.decorator";
import { IpcEventController } from "@util/ipc/ipc-event.controller";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../preload/channels";
import { GameLifecycleService } from "../game-lifecycle/game-lifecycle.service";
import { LoggerService } from "../logger/logger.service";
import { WindowService } from "../window/window.service";
import { GAME_CHANNELS } from "./game.channels";
import { GameService } from "./game.service";

@Service()
export class GameController extends IpcEventController {
  constructor(
    private readonly gameLifecycleService: GameLifecycleService,
    private readonly gameService: GameService,
    readonly logger: LoggerService,
    private readonly windowService: WindowService,
  ) {
    super(logger);
  }

  @IpcHandle(GAME_CHANNELS.GET_FILTERS)
  async getGameFilters() {
    this.logHandler(GAME_CHANNELS.GET_FILTERS);
    return this.gameService.getGameFilters();
  }

  @IpcHandle(GAME_CHANNELS.GET_BY_ID)
  async getGameById(id: string) {
    this.logHandler(GAME_CHANNELS.GET_BY_ID, { id });
    return this.gameService.getGameById(id);
  }

  @IpcHandle(GAME_CHANNELS.GET_BY_COLLECTION)
  async getGamesByCollection(collectionId: string) {
    this.logHandler(GAME_CHANNELS.GET_BY_COLLECTION, { collectionId });
    return this.gameService.getGamesByCollectionId(collectionId);
  }

  @IpcHandle(GAME_CHANNELS.GET_PROTONDB_TIER)
  async getProtondbTier(id: string) {
    this.logHandler(GAME_CHANNELS.GET_PROTONDB_TIER, { id });
    return this.gameService.getProtondbTier(id);
  }

  @IpcHandle(GAME_CHANNELS.ARCHIVE_BY_ID)
  async archiveGameById(id: string) {
    this.logHandler(GAME_CHANNELS.ARCHIVE_BY_ID, { id });
    try {
      const archived = await this.gameService.archiveGame(id);
      if (archived) {
        this.windowService.sendEvent(EVENT_CHANNELS.GAMES_LIST_UPDATED);
        this.logger.info("Game archived", { id });
      }
      return archived;
    } catch (error) {
      this.logger.error("Failed to archive game", error, { id });
      throw error;
    }
  }

  @IpcHandle(GAME_CHANNELS.DELETE_BY_ID)
  async deleteGameById(id: string) {
    this.logHandler(GAME_CHANNELS.DELETE_BY_ID, { id });
    try {
      const deleted = await this.gameService.deleteGame(id);
      if (deleted) {
        this.windowService.sendEvent(EVENT_CHANNELS.GAMES_LIST_UPDATED);
        this.logger.info("Game deleted", { id });
      }
      return deleted;
    } catch (error) {
      this.logger.error("Failed to delete game", error, { id });
      throw error;
    }
  }

  @IpcHandle(GAME_CHANNELS.GET_LIST)
  async getGamesList() {
    this.logHandler(GAME_CHANNELS.GET_LIST);
    return this.gameService.getGamesList();
  }

  @IpcHandle(GAME_CHANNELS.GET_FILTERED)
  async getFilteredGames(filters: GameFilters) {
    this.logHandler(GAME_CHANNELS.GET_FILTERED, { filters });
    return this.gameService.getFilteredGames(filters);
  }

  @IpcHandle(GAME_CHANNELS.GET_NEW)
  async getNewGames() {
    this.logHandler(GAME_CHANNELS.GET_NEW);
    return this.gameService.getNewGames();
  }

  @IpcHandle(GAME_CHANNELS.TOGGLE_FAVOURITE)
  async toggleFavouriteGame(id: string) {
    this.logHandler(GAME_CHANNELS.TOGGLE_FAVOURITE, { id });
    try {
      const updated = await this.gameService.toggleFavouriteGame(id);
      if (updated) {
        this.windowService.sendEvent(EVENT_CHANNELS.GAMES_LIST_UPDATED);
        this.logger.info("Game favourite status updated", { id, isFavourite: updated.isFavourite });
      }
      return updated;
    } catch (error) {
      this.logger.error("Failed to toggle game favourite status", error, { id });
      throw error;
    }
  }

  @IpcHandle(GAME_CHANNELS.TOGGLE_QUICK_LAUNCH)
  async toggleQuickLaunchGame(id: string) {
    this.logHandler(GAME_CHANNELS.TOGGLE_QUICK_LAUNCH, { id });
    try {
      const updated = await this.gameService.toggleQuickLaunchGame(id);
      if (updated) {
        this.windowService.sendEvent(EVENT_CHANNELS.GAMES_LIST_UPDATED);
        this.logger.info("Game quick launch status updated", { id, isQuickLaunch: updated.isQuickLaunch });
      }
      return updated;
    } catch (error) {
      this.logger.error("Failed to toggle game quick launch status", error, { id });
      throw error;
    }
  }

  @IpcHandle(GAME_CHANNELS.GET_QUICK_LAUNCH)
  async getQuickLaunchGames() {
    this.logHandler(GAME_CHANNELS.GET_QUICK_LAUNCH);
    return this.gameService.getQuickLaunchGames();
  }

  @IpcOn(GAME_CHANNELS.LAUNCH)
  async launchGame(id: string) {
    this.logHandler(GAME_CHANNELS.LAUNCH, { id });
    return this.gameLifecycleService.launchGame(id);
  }

  @IpcOn(GAME_CHANNELS.INSTALL)
  async installGame(id: string) {
    this.logHandler(GAME_CHANNELS.INSTALL, { id });
    return this.gameLifecycleService.installGame(id);
  }

  @IpcOn(GAME_CHANNELS.UNINSTALL)
  async uninstallGame(id: string) {
    this.logHandler(GAME_CHANNELS.UNINSTALL, { id });
    return this.gameLifecycleService.uninstallGame(id);
  }
}
