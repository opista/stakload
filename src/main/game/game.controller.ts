import { GameFilters } from "@contracts/database/games";
import { IpcMainInvokeEvent } from "electron";

import { LaunchService } from "../launch/launch.service";
import { BaseController } from "../util/base.controller";
import { IpcHandle, IpcOn } from "../util/ipc.decorator";
import { GAME_CHANNELS } from "./game.channels";
import { GameService } from "./game.service";

export class GameController extends BaseController {
  constructor(
    private readonly gameService: GameService,
    private readonly launchService: LaunchService,
  ) {
    super();
  }

  @IpcHandle(GAME_CHANNELS.GET_FILTERS)
  async getGameFilters(_event: IpcMainInvokeEvent) {
    return this.gameService.getGameFilters();
  }

  @IpcHandle(GAME_CHANNELS.GET_BY_ID)
  async getGameById(_event: IpcMainInvokeEvent, id: string) {
    return this.gameService.getGameById(id);
  }

  @IpcHandle(GAME_CHANNELS.GET_BY_COLLECTION)
  async getGamesByCollection(_event: IpcMainInvokeEvent, collectionId: string) {
    return this.gameService.getGamesByCollectionId(collectionId);
  }

  @IpcHandle(GAME_CHANNELS.GET_PROTONDB_TIER)
  async getProtondbTier(_event: IpcMainInvokeEvent, id: string) {
    return this.gameService.getProtondbTier(id);
  }

  @IpcHandle(GAME_CHANNELS.REMOVE)
  async removeGame(_event: IpcMainInvokeEvent, id: string, preventReadd: boolean) {
    return this.gameService.removeGame(id, preventReadd);
  }

  @IpcHandle(GAME_CHANNELS.GET_LIST)
  async getGamesList(_event: IpcMainInvokeEvent) {
    return this.gameService.getGamesList();
  }

  @IpcHandle(GAME_CHANNELS.GET_FILTERED)
  async getFilteredGames(_event: IpcMainInvokeEvent, filters: GameFilters) {
    return this.gameService.getFilteredGames(filters);
  }

  @IpcHandle(GAME_CHANNELS.GET_NEW)
  async getNewGames(_event: IpcMainInvokeEvent) {
    return this.gameService.getNewGames();
  }

  @IpcHandle(GAME_CHANNELS.TOGGLE_FAVOURITE)
  async toggleFavouriteGame(_event: IpcMainInvokeEvent, id: string) {
    return this.gameService.toggleFavouriteGame(id);
  }

  @IpcHandle(GAME_CHANNELS.TOGGLE_QUICK_LAUNCH)
  async toggleQuickLaunchGame(_event: IpcMainInvokeEvent, id: string) {
    return this.gameService.toggleQuickLaunchGame(id);
  }

  @IpcHandle(GAME_CHANNELS.GET_QUICK_LAUNCH)
  async getQuickLaunchGames(_event: IpcMainInvokeEvent) {
    return this.gameService.getQuickLaunchGames();
  }

  @IpcOn(GAME_CHANNELS.LAUNCH)
  async launchGame(_event: IpcMainInvokeEvent, id: string) {
    return this.launchService.launchGame(id);
  }

  @IpcOn(GAME_CHANNELS.INSTALL)
  async installGame(_event: IpcMainInvokeEvent, id: string) {
    return this.launchService.installGame(id);
  }

  @IpcOn(GAME_CHANNELS.UNINSTALL)
  async uninstallGame(_event: IpcMainInvokeEvent, id: string) {
    return this.launchService.uninstallGame(id);
  }
}
