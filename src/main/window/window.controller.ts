import { IpcController, IpcOn } from "@electron-ipc-bridge/core";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";

import { WindowService } from "./window.service";

@IpcController()
@Service()
export class WindowController {
  constructor(
    private readonly logger: LoggerService,
    private readonly windowService: WindowService,
  ) {}

  @IpcOn()
  close() {
    this.logger.info("Handling IPC message");
    this.windowService.close();
  }

  @IpcOn()
  maximize() {
    this.logger.info("Handling IPC message");
    this.windowService.toggleMaximized();
  }

  @IpcOn()
  minimize() {
    this.logger.info("Handling IPC message");
    this.windowService.minimize();
  }
}
