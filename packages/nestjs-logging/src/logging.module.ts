import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

import { createPinoHttpConfig } from "./pino.config";

@Module({
  exports: [LoggerModule],
  imports: [
    LoggerModule.forRoot({
      pinoHttp: createPinoHttpConfig(),
    }),
  ],
})
export class LoggingModule {}
