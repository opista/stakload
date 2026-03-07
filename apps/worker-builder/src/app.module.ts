import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";

import { AppConfigModule } from "./config/app-config.module";
import { AppConfigService } from "./config/app-config.service";
import { GAME_BUILD_QUEUE_NAME } from "./constants";
import { GameBuildProcessor } from "./game-build.processor";
import { GameBuildService } from "./game-build.service";

@Module({
  exports: [GameBuildService],
  imports: [
    AppConfigModule,
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
  ],
  providers: [GameBuildProcessor, GameBuildService],
})
export class AppModule {}
