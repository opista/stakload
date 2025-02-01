import { Library, LikeLibrary } from "@contracts/database/games";
import { IpcMainInvokeEvent } from "electron";

import { BaseController } from "../util/base.controller";
import { IpcHandle, IpcOn } from "../util/ipc.decorator";
import { SYNC_CHANNELS } from "./sync.channels";
import { SyncService } from "./sync.service";

export class SyncController extends BaseController {
  constructor(private syncService: SyncService) {
    super();
  }

  @IpcOn(SYNC_CHANNELS.SYNC)
  async syncGames(_event: IpcMainInvokeEvent) {
    // TODO - Stop hardcoding this at some point
    return this.syncService.sync([Library.EpicGameStore, Library.Steam]);
  }

  @IpcHandle(SYNC_CHANNELS.TEST_INTEGRATION)
  async testIntegration(_event: IpcMainInvokeEvent, library: LikeLibrary) {
    return this.syncService.isIntegrationValid(library);
  }
}
