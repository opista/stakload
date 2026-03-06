import { Module, forwardRef } from "@nestjs/common";

import { IgdbApiModule } from "../igdb-api/igdb-api.module";
import { ScheduledWebhookSyncModule } from "../scheduled-webhook-sync/scheduled-webhook-sync.module";
import { IgdbWebhookSecretGuard } from "../webhooks/guards/igdb-webhook-secret.guard";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  controllers: [AdminController],
  exports: [AdminService],
  imports: [IgdbApiModule, forwardRef(() => ScheduledWebhookSyncModule)],
  providers: [AdminService, IgdbWebhookSecretGuard],
})
export class AdminModule {}
