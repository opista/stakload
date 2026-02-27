import { Global, Module } from "@nestjs/common";

import { LoggingController } from "./logging.controller";
import { Logger } from "./logging.service";

@Global()
@Module({
  controllers: [LoggingController],
  exports: [Logger],
  providers: [Logger],
})
export class LoggingModule {}
