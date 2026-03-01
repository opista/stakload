import { IpcController, IpcHandle, IpcOn } from "@electron-ipc-bridge/core";
import { Controller } from "@nestjs/common";
import { app, shell } from "electron";

import { Logger } from "./logging.service";

@IpcController()
@Controller()
export class LoggingController {
  private readonly logger = new Logger("Renderer");

  @IpcHandle()
  getLogsPath(): string {
    return app.getPath("logs");
  }

  @IpcOn()
  openLogsFolder() {
    return shell.openPath(app.getPath("logs"));
  }

  @IpcOn()
  rendererLog(level: string, message: string, context?: string) {
    const ctx = context ? `Renderer:${context}` : "Renderer";
    this.logger.setContext(ctx);

    switch (level) {
      case "error":
        this.logger.error(message);
        break;
      case "warn":
        this.logger.warn(message);
        break;
      case "debug":
        this.logger.debug(message);
        break;
      case "verbose":
        this.logger.verbose(message);
        break;
      default:
        this.logger.log(message);
        break;
    }
  }
}
