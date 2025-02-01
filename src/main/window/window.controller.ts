import { Service } from "typedi";

import { BaseController } from "../util/base.controller";
import { IpcOn } from "../util/ipc.decorator";
import { WINDOW_CHANNELS } from "./window.channels";
import { WindowService } from "./window.service";

@Service()
export class WindowController extends BaseController {
  constructor(private readonly windowService: WindowService) {
    super();
  }

  @IpcOn(WINDOW_CHANNELS.MINIMIZE)
  minimize() {
    console.log("minimizing", this.windowService);
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
