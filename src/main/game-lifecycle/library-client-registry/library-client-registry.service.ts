import { Library } from "@contracts/database/games";
import { Injectable } from "@nestjs/common";
import { assertNever } from "@util/assert-never";

import { BattleNetClientService } from "../../integrations/battle-net/client/battle-net-client.service";
import { EpicGamesStoreClientService } from "../../integrations/epic-games-store/client/epic-games-store-client.service";
import { GogClientService } from "../../integrations/gog/client/gog-client.service";
import { SteamClientService } from "../../integrations/steam/client/steam-client.service";
import { Logger } from "../../logging/logging.service";

import { LibraryClientService } from "./types";

@Injectable()
export class LibraryClientRegistryService {
  constructor(
    private readonly logger: Logger,
    private readonly battleNetClientService: BattleNetClientService,
    private readonly epicGamesStoreClientService: EpicGamesStoreClientService,
    private readonly gogClientService: GogClientService,
    private readonly steamClientService: SteamClientService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  getLibrary(library: Library): LibraryClientService {
    switch (library) {
      case "battle-net": {
        return this.battleNetClientService;
      }
      case "epic-game-store": {
        return this.epicGamesStoreClientService;
      }
      case "gog": {
        return this.gogClientService;
      }
      case "steam": {
        return this.steamClientService;
      }
      default: {
        return assertNever(library);
      }
    }
  }
}
