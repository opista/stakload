import { ipcMain } from "electron";
import { Service } from "typedi";

@Service()
export abstract class BaseController {
  constructor() {
    this.registerIpcHandlers();
  }

  private registerIpcHandlers() {
    const handlers = (this.constructor as any)._ipcHandlers || [];

    for (const { channel, handler, type } of handlers) {
      const boundHandler = handler.bind(this);

      if (type === "handle") {
        ipcMain.handle(channel, boundHandler);
      } else if (type === "on") {
        ipcMain.on(channel, boundHandler);
      }
    }
  }
}
