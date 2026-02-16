import { IpcController, IpcHandle, IpcOn } from "@electron-ipc-bridge/core";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";

import { SystemService } from "./system.service";

@IpcController()
@Service()
export class SystemController {
  constructor(
    private readonly logger: LoggerService,
    private readonly systemService: SystemService,
  ) {}

  @IpcHandle()
  getPlatform() {
    this.logger.info("Handling IPC message");
    return process.platform;
  }

  @IpcOn()
  restartApplication() {
    this.logger.info("Handling IPC message");
    return this.systemService.restartApplication();
  }

  @IpcOn()
  async restartDevice() {
    this.logger.info("Handling IPC message");
    return this.systemService.restart();
  }

  @IpcOn()
  async shutdownDevice() {
    this.logger.info("Handling IPC message");
    return this.systemService.shutdown();
  }

  @IpcOn()
  async sleepDevice() {
    this.logger.info("Handling IPC message");
    return this.systemService.sleep();
  }
}
