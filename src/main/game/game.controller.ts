import type { GameFilters } from "@contracts/database/games";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../preload/channels";
import { LaunchService } from "../launch/launch.service";
import { IpcHandle, IpcOn } from "../util/ipc.decorator";
import { IpcEventController } from "../util/ipc-event.controller";
import { WindowService } from "../window/window.service";
import { GAME_CHANNELS } from "./game.channels";
import { GameService } from "./game.service";

@Service()
export class GameController extends IpcEventController {
  constructor(
    private readonly gameService: GameService,
    private readonly launchService: LaunchService,
    private readonly windowService: WindowService,
  ) {
    super();
  }

  @IpcHandle(GAME_CHANNELS.GET_FILTERS)
  async getGameFilters() {
    return this.gameService.getGameFilters();
  }

  @IpcHandle(GAME_CHANNELS.GET_BY_ID)
  async getGameById(id: string) {
    return this.gameService.getGameById(id);
  }

  @IpcHandle(GAME_CHANNELS.GET_BY_COLLECTION)
  async getGamesByCollection(collectionId: string) {
    return this.gameService.getGamesByCollectionId(collectionId);
  }

  @IpcHandle(GAME_CHANNELS.GET_PROTONDB_TIER)
  async getProtondbTier(id: string) {
    return this.gameService.getProtondbTier(id);
  }

  @IpcHandle(GAME_CHANNELS.ARCHIVE_BY_ID)
  async archiveGameById(id: string) {
    await this.gameService.archiveGame(id);
    this.windowService.sendEvent(EVENT_CHANNELS.GAMES_LIST_UPDATED);
    return true;
  }

  @IpcHandle(GAME_CHANNELS.DELETE_BY_ID)
  async deleteGameById(id: string) {
    await this.gameService.deleteGame(id);
    this.windowService.sendEvent(EVENT_CHANNELS.GAMES_LIST_UPDATED);
    return true;
  }

  @IpcHandle(GAME_CHANNELS.GET_LIST)
  async getGamesList() {
    return this.gameService.getGamesList();
  }

  @IpcHandle(GAME_CHANNELS.GET_FILTERED)
  async getFilteredGames(filters: GameFilters) {
    return this.gameService.getFilteredGames(filters);
  }

  @IpcHandle(GAME_CHANNELS.GET_NEW)
  async getNewGames() {
    return this.gameService.getNewGames();
  }

  @IpcHandle(GAME_CHANNELS.TOGGLE_FAVOURITE)
  async toggleFavouriteGame(id: string) {
    const updated = await this.gameService.toggleFavouriteGame(id);
    if (updated) {
      this.windowService.sendEvent(EVENT_CHANNELS.GAMES_LIST_UPDATED);
    }
    return updated;
  }

  @IpcHandle(GAME_CHANNELS.TOGGLE_QUICK_LAUNCH)
  async toggleQuickLaunchGame(id: string) {
    const updated = await this.gameService.toggleQuickLaunchGame(id);
    if (updated) {
      this.windowService.sendEvent(EVENT_CHANNELS.GAMES_LIST_UPDATED);
    }
    return updated;
  }

  @IpcHandle(GAME_CHANNELS.GET_QUICK_LAUNCH)
  async getQuickLaunchGames() {
    return this.gameService.getQuickLaunchGames();
  }

  @IpcOn(GAME_CHANNELS.LAUNCH)
  async launchGame(id: string) {
    return this.launchService.launchGame(id);
  }

  @IpcOn(GAME_CHANNELS.INSTALL)
  async installGame(id: string) {
    return this.launchService.installGame(id);
  }

  @IpcOn(GAME_CHANNELS.UNINSTALL)
  async uninstallGame(id: string) {
    return this.launchService.uninstallGame(id);
  }
}
