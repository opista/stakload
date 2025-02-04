import type { Library } from "@contracts/database/games";
import { IpcHandle } from "@util/ipc/ipc.decorator";
import { IpcEventController } from "@util/ipc/ipc-event.controller";
import { Service } from "typedi";

import { INTEGRATION_CHANNELS } from "../../preload/channels";
import { SharedConfigService } from "../config/shared-config.service";
import { GogApiService } from "../integrations/gog/api/gog-api.service";
import { IntegrationService } from "./integration.service";
@Service()
export class IntegrationController extends IpcEventController {
  constructor(
    private readonly sharedConfigService: SharedConfigService,
    private readonly integrationService: IntegrationService,
    private readonly gogApiService: GogApiService,
  ) {
    super();
  }

  @IpcHandle(INTEGRATION_CHANNELS.AUTHENTICATE)
  async authenticate(library: Library) {
    const config = this.sharedConfigService.get("integration_settings.state.gogIntegration", { decrypt: true });
    if (!config) {
      throw new Error("GOG integration not found");
    }

    const games = await this.gogApiService.getOwnedGames(config.accessToken);
    console.log({ games });
    // await this.integrationService.authenticate(library);
  }
}
