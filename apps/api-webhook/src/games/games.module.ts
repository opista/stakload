import { Module } from "@nestjs/common";

import { RedisModule } from "@stakload/nestjs-redis";

import { AppConfigService } from "../config/app-config.service";
import { DatabaseModule } from "../database/database.module";
import { GamesController } from "./games.controller";
import { GamesService } from "./games.service";

@Module({
  controllers: [GamesController],
  imports: [
    DatabaseModule,
    RedisModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        host: config.redisHost,
        password: config.redisPassword,
        port: config.redisPort,
      }),
    }),
  ],
  providers: [GamesService],
})
export class GamesModule {}
