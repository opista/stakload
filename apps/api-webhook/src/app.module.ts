import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { LoggingModule } from "@stakload/nestjs-logging";

import { AdminModule } from "./admin/admin.module";
import { AppConfigModule } from "./config/app-config.module";
import { DatabaseModule } from "./database/database.module";
import { GamesModule } from "./games/games.module";
import { ScheduledWebhookSyncModule } from "./scheduled-webhook-sync/scheduled-webhook-sync.module";
import { IgdbWebhookModule } from "./webhooks/igdb-webhook.module";

@Module({
  imports: [
    AppConfigModule,
    LoggingModule,
    DatabaseModule,
    GamesModule,
    ScheduleModule.forRoot(),
    AdminModule,
    ScheduledWebhookSyncModule,
    IgdbWebhookModule,
  ],
})
export class AppModule {}
