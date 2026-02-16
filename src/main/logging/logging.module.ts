import { ConsoleLogger, Global, Module, Scope } from "@nestjs/common";
import { INQUIRER } from "@nestjs/core";

import { CorrelationLogger } from "./logging.service";

@Global()
@Module({
  exports: [ConsoleLogger],
  providers: [
    {
      inject: [INQUIRER],
      provide: ConsoleLogger,
      scope: Scope.TRANSIENT,
      useFactory: () =>
        new CorrelationLogger({
          colors: true,
          compact: true,
          timestamp: true,
        }),
    },
  ],
})
export class LoggingModule {}
