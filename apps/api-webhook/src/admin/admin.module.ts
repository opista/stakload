import { Module } from "@nestjs/common";

import { IgdbApiModule } from "../igdb-api/igdb-api.module";
import { IgdbWebhookSecretGuard } from "../webhooks/guards/igdb-webhook-secret.guard";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  controllers: [AdminController],
  imports: [IgdbApiModule],
  providers: [AdminService, IgdbWebhookSecretGuard],
})
export class AdminModule {}
