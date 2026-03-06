import { Module, forwardRef } from "@nestjs/common";

import { AdminModule } from "../admin/admin.module";
import { DatabaseModule } from "../database/database.module";
import { SyncRunnerService } from "./services/sync-runner.service";
import { SyncSchedulerService } from "./services/sync-scheduler.service";

@Module({
  exports: [SyncRunnerService],
  imports: [DatabaseModule, forwardRef(() => AdminModule)],
  providers: [SyncRunnerService, SyncSchedulerService],
})
export class ScheduledWebhookSyncModule {}
