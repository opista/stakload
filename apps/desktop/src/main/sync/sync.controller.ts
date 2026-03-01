import { IpcController, IpcHandle, IpcOn } from "@electron-ipc-bridge/core";
import { Controller } from "@nestjs/common";
import type { Library } from "@stakload/contracts/database/games";

import { Logger } from "../logging/logging.service";

import { SyncService } from "./sync.service";

@IpcController()
@Controller()
export class SyncController {
  constructor(
    private readonly logger: Logger,
    private readonly syncService: SyncService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @IpcHandle()
  async authIntegration(library: Library, data?: unknown) {
    this.logger.log("Handling IPC message", { library });
    try {
      const authResult = await this.syncService.authenticate(library, data);
      this.logger.log("Authentication completed", { library });
      return authResult;
    } catch (error: unknown) {
      this.logger.error("Error in authIntegration", { error, library });
      throw error;
    }
  }

  @IpcOn()
  syncGames() {
    this.logger.log("Handling IPC message");
    try {
      const result = this.syncService.sync();
      this.logger.log("Sync operation initiated", { result });
      return result;
    } catch (error: unknown) {
      this.logger.error("Error in syncGames", { error });
      throw error;
    }
  }

  @IpcHandle()
  async testIntegration(library: Library) {
    this.logger.log("Handling IPC message", { library });
    try {
      const valid = await this.syncService.isIntegrationValid(library);
      this.logger.log("Test integration complete", { library, valid });
      return valid;
    } catch (error: unknown) {
      this.logger.error("Error in testIntegration", { error, library });
      throw error;
    }
  }
}
