import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GAME_BUILD_QUEUE_NAME } from "@stakload/game-cache-contracts";
import { RedisModule } from "@stakload/nestjs-redis";

import { AppConfigModule } from "./config/app-config.module";
import { AppConfigService } from "./config/app-config.service";
import { GameBuildProcessor } from "./game-build.processor";
import { GameAggregateQueryService } from "./game-build/services/game-aggregate-query.service";
import { GameCacheWriteService } from "./game-build/services/game-cache-write.service";

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        synchronize: false,
        type: "postgres",
        url: config.databaseUrl,
      }),
    }),
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
  providers: [GameAggregateQueryService, GameCacheWriteService, GameBuildProcessor],
})
export class AppModule {}
