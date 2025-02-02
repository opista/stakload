import type { LikeLibrary } from "@contracts/database/games";
import { Library } from "@contracts/database/games";
import { Service } from "typedi";

import { IpcHandle, IpcOn } from "../util/ipc.decorator";
import { IpcEventController } from "../util/ipc-event.controller";
import { SYNC_CHANNELS } from "./sync.channels";
import { SyncService } from "./sync.service";

@Service()
export class SyncController extends IpcEventController {
  constructor(private syncService: SyncService) {
    super();
  }

  @IpcOn(SYNC_CHANNELS.SYNC)
  async syncGames() {
    // TODO - Stop hardcoding this at some point
    return this.syncService.sync([Library.EpicGameStore, Library.Steam]);
  }

  @IpcHandle(SYNC_CHANNELS.TEST_INTEGRATION)
  async testIntegration(library: LikeLibrary) {
    const res = await this.syncService.isIntegrationValid(library);
    return res;
  }
}
