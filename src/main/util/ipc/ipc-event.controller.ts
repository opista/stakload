import { Service } from "typedi";

import { LoggerService } from "../../logger/logger.service";

@Service()
export abstract class IpcEventController {
  constructor(readonly logger: LoggerService) {}

  logHandler(channel: string, context?: Record<string, unknown>) {
    this.logger.info("Handling IPC message", { channel, ...context });
  }
}
