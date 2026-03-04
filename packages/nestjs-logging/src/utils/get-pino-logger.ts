import { PinoLogger } from "nestjs-pino";

import { createPinoHttpConfig } from "../pino.config";

export const getPinoLogger = (): PinoLogger =>
  new PinoLogger({
    pinoHttp: createPinoHttpConfig(),
  });
