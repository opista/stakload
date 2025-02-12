import { ipcMain } from "electron";
import { Service } from "typedi";

import { LoggerService } from "../../logger/logger.service";

interface IpcHandler {
  channel: string;
  handler: Function;
  type: "handle" | "on";
}

@Service()
export abstract class IpcEventController {
  constructor(readonly logger: LoggerService) {
    this.registerIpcHandlers();
  }

  private registerIpcHandlers() {
    const constructor = this.constructor as { _ipcHandlers?: IpcHandler[] };
    const handlers = constructor._ipcHandlers || [];

    for (const { channel, handler, type } of handlers) {
      const boundHandler = handler.bind(this);

      if (type === "handle") {
        ipcMain.handle(channel, boundHandler);
      } else if (type === "on") {
        ipcMain.on(channel, boundHandler);
      }
    }
  }

  logHandler(channel: string, context?: Record<string, unknown>) {
    this.logger.info("Handling IPC message", { channel, ...context });
  }
}
