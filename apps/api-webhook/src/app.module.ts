import { Module } from "@nestjs/common";

import { LoggingModule } from "@stakload/nestjs-logging";

import { AdminModule } from "./admin/admin.module";
import { AppConfigModule } from "./config/app-config.module";
import { DatabaseModule } from "./database/database.module";
import { IgdbWebhookModule } from "./webhooks/igdb/igdb-webhook.module";

@Module({
  imports: [AppConfigModule, LoggingModule, DatabaseModule, AdminModule, IgdbWebhookModule],
})
export class AppModule {}
