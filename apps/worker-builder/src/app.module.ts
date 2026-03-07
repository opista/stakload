import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";

import { AppConfigModule } from "./config/app-config.module";
import { AppConfigService } from "./config/app-config.service";
import { GAME_BUILD_QUEUE_NAME } from "./constants";
import { GameBuildProcessor } from "./game-build.processor";

@Module({
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
  providers: [GameBuildProcessor],
})
export class AppModule {}
