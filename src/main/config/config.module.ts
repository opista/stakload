import { Global, Module } from "@nestjs/common";
import { Conf } from "electron-conf/main";

import { SharedConfigService } from "./shared-config.service";

@Global()
@Module({
  exports: [SharedConfigService],
  providers: [
    {
      provide: "conf",
      useFactory: () => {
        const conf = new Conf();
        conf.registerRendererListener();
        return conf;
      },
    },
    SharedConfigService,
  ],
})
export class ConfigModule {}
