import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { LoggingModule } from "@stakload/nestjs-logging";

import { APP_CONFIG_SCHEMA } from "./app-config.schema";
import { AppConfigService } from "./app-config.service";

@Global()
@Module({
  exports: [AppConfigService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: APP_CONFIG_SCHEMA,
    }),
    LoggingModule,
  ],
  providers: [AppConfigService],
})
export class AppConfigModule {}
