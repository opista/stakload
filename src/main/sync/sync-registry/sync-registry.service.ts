import { Library } from "@contracts/database/games";
import { assertNever } from "@util/assert-never";
import { Service } from "typedi";

import { BattleNetLibraryService } from "../../integrations/battle-net/sync/battle-net-sync.service";
import { EpicGamesStoreSyncService } from "../../integrations/epic-games-store/sync/epic-games-store-sync.service";
import { GogLibraryService } from "../../integrations/gog/sync/gog-sync.service";
import { SteamLibraryService } from "../../integrations/steam/sync/steam-sync.service";

import { SyncService } from "./types";

@Service()
export class SyncRegistryService {
  constructor(
    private battleNetLibraryService: BattleNetLibraryService,
    private epicGamesStoreSyncService: EpicGamesStoreSyncService,
    private gogLibraryService: GogLibraryService,
    private steamLibraryService: SteamLibraryService,
  ) {}

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
