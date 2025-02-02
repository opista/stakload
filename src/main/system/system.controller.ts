import { Service } from "typedi";

import { IpcEventController } from "../util/ipc-event.controller";
import { IpcOn } from "../util/ipc.decorator";
import { IpcHandle } from "../util/ipc.decorator";
import { SYSTEM_CHANNELS } from "./system.channels";
import { SystemService } from "./system.service";

@Service()
export class SystemController extends IpcEventController {
  constructor(private readonly systemService: SystemService) {
    super();
  }

  @IpcHandle(SYSTEM_CHANNELS.GET_LOCALE)
  async getLocale() {
    return this.systemService.getLocale();
  }

  @IpcOn(SYSTEM_CHANNELS.RESTART_APP)
  async restartApplication() {
    return this.systemService.restartApplication();
  }

  @IpcOn(SYSTEM_CHANNELS.RESTART_DEVICE)
  async restartDevice() {
    return this.systemService.restart();
  }

  @IpcOn(SYSTEM_CHANNELS.SHUTDOWN_DEVICE)
  async shutdownDevice() {
    return this.systemService.shutdown();
  }

  @IpcOn(SYSTEM_CHANNELS.SLEEP_DEVICE)
  async sleepDevice() {
    return this.systemService.sleep();
  }
}
