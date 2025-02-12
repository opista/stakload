import { IpcOn } from "@util/ipc/ipc.decorator";
import { IpcEventController } from "@util/ipc/ipc-event.controller";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";
import { WINDOW_CHANNELS } from "./window.channels";
import { WindowService } from "./window.service";

@Service()
export class WindowController extends IpcEventController {
  constructor(
    readonly logger: LoggerService,
    private readonly windowService: WindowService,
  ) {
    super(logger);
  }

  @IpcOn(WINDOW_CHANNELS.MINIMIZE)
  minimize() {
    this.logHandler(WINDOW_CHANNELS.MINIMIZE);
    this.windowService.minimize();
  }

  @IpcOn(WINDOW_CHANNELS.MAXIMIZE)
  maximize() {
    this.logHandler(WINDOW_CHANNELS.MAXIMIZE);
    this.windowService.toggleMaximized();
  }

  @IpcOn(WINDOW_CHANNELS.CLOSE)
  close() {
    this.logHandler(WINDOW_CHANNELS.CLOSE);
    this.windowService.close();
  }
}
