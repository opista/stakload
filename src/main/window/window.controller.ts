import { Service } from "typedi";

import { IpcOn } from "../util/ipc.decorator";
import { IpcEventController } from "../util/ipc-event.controller";
import { WINDOW_CHANNELS } from "./window.channels";
import { WindowService } from "./window.service";

@Service()
export class WindowController extends IpcEventController {
  constructor(private readonly windowService: WindowService) {
    super();
  }

  @IpcOn(WINDOW_CHANNELS.MINIMIZE)
  minimize() {
    this.windowService.minimize();
  }

  @IpcOn(WINDOW_CHANNELS.MAXIMIZE)
  maximize() {
    this.windowService.toggleMaximized();
  }

  @IpcOn(WINDOW_CHANNELS.CLOSE)
  close() {
    this.windowService.close();
  }
}
