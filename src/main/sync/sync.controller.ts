import type { Library } from "@contracts/database/games";
import { IpcController, IpcHandle, IpcOn } from "@electron-ipc-bridge/core";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";

import { SyncService } from "./sync.service";

@IpcController()
@Service()
export class SyncController {
  constructor(
    private readonly logger: LoggerService,
    private readonly syncService: SyncService,
  ) {}

  @IpcHandle()
  async authIntegration(library: Library, data?: unknown) {
    this.logger.info("Handling IPC message", { library });
    try {
      const authResult = await this.syncService.authenticate(library, data);
      this.logger.info("Authentication completed", { library });
      return authResult;
    } catch (error: unknown) {
      this.logger.error("Error in authIntegration", { error, library });
      throw error;
    }
  }

  @IpcOn()
  syncGames() {
    this.logger.info("Handling IPC message");
    try {
      const result = this.syncService.sync();
      this.logger.info("Sync operation initiated", { result });
      return result;
    } catch (error: unknown) {
      this.logger.error("Error in syncGames", { error });
      throw error;
    }
  }

  @IpcHandle()
  async testIntegration(library: Library) {
    this.logger.info("Handling IPC message", { library });
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
