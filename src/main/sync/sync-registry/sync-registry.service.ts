import { Library } from "@contracts/database/games";
import { assertNever } from "@util/assert-never";
import { Service } from "typedi";

import { EpicGamesStoreSyncService } from "../../libraries/epic-games-store/sync/epic-games-store-sync.service";
import { SteamLibraryService } from "../../libraries/steam/sync/steam-sync.service";
import { SyncService } from "./types";

@Service()
export class SyncRegistryService {
  constructor(
    private epicGamesStoreSyncService: EpicGamesStoreSyncService,
    private steamLibraryService: SteamLibraryService,
  ) {}

  getLibrary(library: Library): SyncService {
    switch (library) {
      case "epic-game-store": {
        return this.epicGamesStoreSyncService;
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
