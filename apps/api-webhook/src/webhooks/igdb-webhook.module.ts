import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";

import { GAME_BUILD_QUEUE_NAME } from "@stakload/game-cache-contracts";
import { RedisModule } from "@stakload/nestjs-redis";

import { AppConfigService } from "../config/app-config.service";
import { DatabaseModule } from "../database/database.module";
import { IgdbWebhookSecretGuard } from "./guards/igdb-webhook-secret.guard";
import { AggregateDeleteHandler } from "./handlers/aggregate-delete.handler";
import { AggregateUpsertHandler } from "./handlers/aggregate-upsert.handler";
import { SimpleDeleteHandler } from "./handlers/simple-delete.handler";
import { SimpleUpsertHandler } from "./handlers/simple-upsert.handler";
import { IgdbWebhookController } from "./igdb-webhook.controller";
import { IgdbTombstoneInterceptor } from "./interceptors/igdb-tombstone.interceptor";
import { ParseIgdbWebhookActionPipe } from "./pipes/parse-igdb-webhook-action.pipe";
import { ParseIgdbWebhookResourcePipe } from "./pipes/parse-igdb-webhook-resource.pipe";
import { IgdbTombstoneService } from "./services/igdb-tombstone.service";
import { IgdbUpsertService } from "./services/igdb-upsert.service";
import { WebhookGameBuildOrchestratorService } from "./services/webhook-game-build-orchestrator.service";
import { IgdbWebhookHandlerResolver } from "./services/igdb-webhook-handler.resolver";

@Module({
  controllers: [IgdbWebhookController],
  imports: [
    DatabaseModule,
    BullModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        connection: {
          host: config.redisHost,
          password: config.redisPassword,
          port: config.redisPort,
        },
      }),
    }),
    BullModule.registerQueue({
      name: GAME_BUILD_QUEUE_NAME,
    }),
    RedisModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        host: config.redisHost,
        password: config.redisPassword,
        port: config.redisPort,
      }),
    }),
  ],
  providers: [
    AggregateDeleteHandler,
    AggregateUpsertHandler,
    IgdbTombstoneInterceptor,
    IgdbTombstoneService,
    IgdbWebhookHandlerResolver,
    IgdbUpsertService,
    IgdbWebhookSecretGuard,
    ParseIgdbWebhookActionPipe,
    ParseIgdbWebhookResourcePipe,
    SimpleDeleteHandler,
    SimpleUpsertHandler,
    WebhookGameBuildOrchestratorService,
  ],
})
export class IgdbWebhookModule {}
