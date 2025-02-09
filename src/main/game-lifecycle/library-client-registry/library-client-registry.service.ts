import { Library } from "@contracts/database/games";
import { assertNever } from "@util/assert-never";
import { Service } from "typedi";

import { EpicGameStoreClientService } from "../../integrations/epic-games-store/client/epic-games-store-client.service";
import { GogClientService } from "../../integrations/gog/client/gog-client.service";
import { SteamClientService } from "../../integrations/steam/client/steam-client.service";
import { LibraryClientService } from "./types";

@Service()
export class LibraryClientRegistryService {
  constructor(
    private readonly epicGamesStoreClientService: EpicGameStoreClientService,
    private readonly gogClientService: GogClientService,
    private readonly steamClientService: SteamClientService,
  ) {}

  getLibrary(library: Library): LibraryClientService {
    switch (library) {
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
