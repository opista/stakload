import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";

import { LoggingModule } from "@stakload/nestjs-logging";

import configuration from "./config/configuration";
import { GAME_BUILD_QUEUE_NAME } from "./constants";
import { GameBuildProcessor } from "./game-build.processor";
import { GameBuildService } from "./game-build.service";

@Module({
  exports: [GameBuildService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        LOG_LEVEL: Joi.string()
          .valid("fatal", "error", "warn", "info", "debug", "trace", "silent")
          .default("info"),
        NODE_ENV: Joi.string()
          .valid("development", "production", "test")
          .default("development"),
        REDIS_HOST: Joi.string().default("redis"),
        REDIS_PASSWORD: Joi.string().allow(""),
        REDIS_PORT: Joi.number().default(6379),
        WORKER_BUILDER_CONCURRENCY: Joi.number().min(1).default(4),
      }),
    }),
    LoggingModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>("redis.host"),
          password: config.get<string>("redis.password"),
          port: config.get<number>("redis.port"),
        },
      }),
    }),
    BullModule.registerQueue({
      name: GAME_BUILD_QUEUE_NAME,
    }),
  ],
  providers: [GameBuildProcessor, GameBuildService],
})
export class AppModule {}
