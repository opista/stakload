import type { Library } from "@contracts/database/games";
import { IpcHandle } from "@util/ipc/ipc.decorator";
import { IpcEventController } from "@util/ipc/ipc-event.controller";
import { Service } from "typedi";

import { INTEGRATION_CHANNELS } from "../../preload/channels";
import { IntegrationService } from "./integration.service";

@Service()
export class IntegrationController extends IpcEventController {
  constructor(private readonly integrationService: IntegrationService) {
    super();
  }

  @IpcHandle(INTEGRATION_CHANNELS.AUTHENTICATE)
  async authenticate(library: Library) {
    await this.integrationService.authenticate(library);
  }
}
