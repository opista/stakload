import type { Library } from "@contracts/database/games";
import { IpcHandle, IpcOn } from "@util/ipc/ipc.decorator";
import { IpcEventController } from "@util/ipc/ipc-event.controller";
import { Service } from "typedi";

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
    return this.syncService.sync(["epic-game-store", "gog", "steam"]);
  }

  @IpcHandle(SYNC_CHANNELS.TEST_INTEGRATION)
  async testIntegration(library: Library) {
    const res = await this.syncService.isIntegrationValid(library);
    return res;
  }
}
