import { IpcController, IpcOn } from "@electron-ipc-bridge/core";
import { Controller } from "@nestjs/common";

import { Logger } from "../logging/logging.service";

import { WindowService } from "./window.service";

@IpcController()
@Controller()
export class WindowController {
  constructor(
    private readonly logger: Logger,
    private readonly windowService: WindowService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @IpcOn()
  close() {
    this.logger.log("Handling IPC message");
    this.windowService.close();
  }

  @IpcOn()
  maximize() {
    this.logger.log("Handling IPC message");
    this.windowService.toggleMaximized();
  }

  @IpcOn()
  minimize() {
    this.logger.log("Handling IPC message");
    this.windowService.minimize();
  }
}
