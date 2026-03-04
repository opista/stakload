import { Module } from "@nestjs/common";

import { LoggingModule } from "@stakload/nestjs-logging";

import { AppConfigModule } from "./config/app-config.module";
import { DatabaseModule } from "./database/database.module";
import { IgdbWebhookModule } from "./webhooks/igdb/igdb-webhook.module";

@Module({
  imports: [AppConfigModule, LoggingModule, DatabaseModule, IgdbWebhookModule],
})
export class AppModule {}
