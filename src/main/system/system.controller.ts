import { IpcOn } from "@util/ipc/ipc.decorator";
import { IpcEventController } from "@util/ipc/ipc-event.controller";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";

import { SYSTEM_CHANNELS } from "./system.channels";
import { SystemService } from "./system.service";

@Service()
export class SystemController extends IpcEventController {
  constructor(
    readonly logger: LoggerService,
    private readonly systemService: SystemService,
  ) {
    super(logger);
  }

  @IpcOn(SYSTEM_CHANNELS.RESTART_APP)
  async restartApplication() {
    this.logHandler(SYSTEM_CHANNELS.RESTART_APP);
    return this.systemService.restartApplication();
  }

  @IpcOn(SYSTEM_CHANNELS.RESTART_DEVICE)
  async restartDevice() {
    this.logHandler(SYSTEM_CHANNELS.RESTART_DEVICE);
    return this.systemService.restart();
  }

  @IpcOn(SYSTEM_CHANNELS.SHUTDOWN_DEVICE)
  async shutdownDevice() {
    this.logHandler(SYSTEM_CHANNELS.SHUTDOWN_DEVICE);
    return this.systemService.shutdown();
  }

  @IpcOn(SYSTEM_CHANNELS.SLEEP_DEVICE)
  async sleepDevice() {
    this.logHandler(SYSTEM_CHANNELS.SLEEP_DEVICE);
    return this.systemService.sleep();
  }
}
