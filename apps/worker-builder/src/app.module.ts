import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RedisModule } from "@stakload/nestjs-redis";

import { AppConfigModule } from "./config/app-config.module";
import { AppConfigService } from "./config/app-config.service";
import { GAME_BUILD_QUEUE_NAME } from "./constants";
import { GameBuildProcessor } from "./game-build.processor";
import { GameAggregateQueryService } from "./game-build/services/game-aggregate-query.service";
import { GameCacheWriteService } from "./game-build/services/game-cache-write.service";

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
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
      useFactory: (...args: unknown[]) => {
        const config = args[0] as AppConfigService;
        return {
          host: config.redisHost,
          password: config.redisPassword,
          port: config.redisPort,
        };
      },
    }),
  ],
  providers: [GameAggregateQueryService, GameCacheWriteService, GameBuildProcessor],
})
export class AppModule {}
