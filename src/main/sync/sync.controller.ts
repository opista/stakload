import type { Library } from "@contracts/database/games";
import { IpcHandle, IpcOn } from "@util/ipc/ipc.decorator";
import { IpcEventController } from "@util/ipc/ipc-event.controller";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";

import { SYNC_CHANNELS } from "./sync.channels";
import { SyncService } from "./sync.service";

@Service()
export class SyncController extends IpcEventController {
  constructor(
    readonly logger: LoggerService,
    private readonly syncService: SyncService,
  ) {
    super(logger);
  }

  @IpcHandle(SYNC_CHANNELS.AUTH_INTEGRATION)
  async authIntegration(library: Library, data?: unknown) {
    this.logHandler(SYNC_CHANNELS.AUTH_INTEGRATION, { library });
    try {
      const authResult = await this.syncService.authenticate(library, data);
      this.logger.info("Authentication completed", { library });
      return authResult;
    } catch (error: unknown) {
      this.logger.error("Error in authIntegration", { error, library });
      throw error;
    }
  }

  @IpcOn(SYNC_CHANNELS.SYNC)
  async syncGames() {
    this.logHandler(SYNC_CHANNELS.SYNC);
    try {
      const result = await this.syncService.sync();
      this.logger.info("Sync operation initiated", { result });
      return result;
    } catch (error: unknown) {
      this.logger.error("Error in syncGames", { error });
      throw error;
    }
  }

  @IpcHandle(SYNC_CHANNELS.TEST_INTEGRATION)
  async testIntegration(library: Library) {
    this.logHandler(SYNC_CHANNELS.TEST_INTEGRATION, { library });
    try {
      const valid = await this.syncService.isIntegrationValid(library);
      this.logger.info("Test integration complete", { library, valid });
      return valid;
    } catch (error: unknown) {
      this.logger.error("Error in testIntegration", { error, library });
      throw error;
    }
  }
}
