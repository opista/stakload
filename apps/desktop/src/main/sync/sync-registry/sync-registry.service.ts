import { Injectable } from "@nestjs/common";

import { Library } from "@stakload/contracts/database/games";
import { assertNever } from "@util/assert-never";

import { BattleNetLibraryService } from "../../integrations/battle-net/sync/battle-net-sync.service";
import { EpicGamesStoreSyncService } from "../../integrations/epic-games-store/sync/epic-games-store-sync.service";
import { GogLibraryService } from "../../integrations/gog/sync/gog-sync.service";
import { SteamLibraryService } from "../../integrations/steam/sync/steam-sync.service";
import { Logger } from "../../logging/logging.service";
import { SyncService } from "./types";

@Injectable()
export class SyncRegistryService {
  constructor(
    private readonly logger: Logger,
    private battleNetLibraryService: BattleNetLibraryService,
    private epicGamesStoreSyncService: EpicGamesStoreSyncService,
    private gogLibraryService: GogLibraryService,
    private steamLibraryService: SteamLibraryService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  getLibrary(library: Library): SyncService {
    switch (library) {
      case "battle-net": {
        return this.battleNetLibraryService;
      }
      case "epic-game-store": {
        return this.epicGamesStoreSyncService;
      }
      case "gog": {
        return this.gogLibraryService;
      }
      case "steam": {
        return this.steamLibraryService;
      }
      default: {
        return assertNever(library);
      }
    }
  }
}
