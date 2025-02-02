import { ipcMain } from "electron";
import { Service } from "typedi";

interface IpcHandler {
  channel: string;
  handler: Function;
  type: "handle" | "on";
}

@Service()
export abstract class IpcEventController {
  constructor() {
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
}
