import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import { PinoLogger } from "@stakload/nestjs-logging";

import { AppConfigService } from "../../config/app-config.service";
import { SyncRunnerService } from "./sync-runner.service";

@Injectable()
export class SyncSchedulerService {
  constructor(
    private readonly configService: AppConfigService,
    private readonly logger: PinoLogger,
    private readonly syncRunnerService: SyncRunnerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Cron("*/30 * * * *")
  async runScheduledSync(): Promise<void> {
    if (this.configService.igdbScheduledSyncEnabled === false) {
      return;
    }

    try {
      const result = await this.syncRunnerService.runManagedSync("scheduled");

      if (result === null) {
        this.logger.warn("Scheduled managed webhook sync skipped due to lock contention");
      }
    } catch (error) {
      this.logger.error({ error }, "Scheduled managed webhook sync failed");
    }
  }
}
