import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

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
  ],
  providers: [AppConfigService],
})
export class AppConfigModule {}
