import { Library } from "@contracts/database/games";
import { assertNever } from "@util/assert-never";
import { Service } from "typedi";

import { EpicGameStoreClientService } from "../../libraries/epic-games-store/client/epic-games-store-client.service";
import { SteamClientService } from "../../libraries/steam/client/steam-client.service";
import { LibraryClientService } from "./types";

@Service()
export class LibraryClientRegistryService {
  constructor(
    private readonly epicGamesStoreClientService: EpicGameStoreClientService,
    private readonly steamClientService: SteamClientService,
  ) {}

  getLibrary(library: Library): LibraryClientService {
    switch (library) {
      case "epic-game-store": {
        return this.epicGamesStoreClientService;
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
