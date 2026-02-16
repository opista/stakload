import { IpcController, IpcHandle, IpcOn } from "@electron-ipc-bridge/core";
import { ConsoleLogger } from "@nestjs/common";
import { Controller } from "@nestjs/common";

import { SystemService } from "./system.service";

@IpcController()
@Controller()
export class SystemController {
  constructor(
    private readonly logger: ConsoleLogger,
    private readonly systemService: SystemService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @IpcHandle()
  getPlatform() {
    this.logger.log("Handling IPC message");
    return process.platform;
  }

  @IpcOn()
  restartApplication() {
    this.logger.log("Handling IPC message");
    return this.systemService.restartApplication();
  }

  @IpcOn()
  async restartDevice() {
    this.logger.log("Handling IPC message");
    return this.systemService.restart();
  }

  @IpcOn()
  async shutdownDevice() {
    this.logger.log("Handling IPC message");
    return this.systemService.shutdown();
  }

  @IpcOn()
  async sleepDevice() {
    this.logger.log("Handling IPC message");
    return this.systemService.sleep();
  }
}
