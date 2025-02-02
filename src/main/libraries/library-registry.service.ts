import { Library } from "@contracts/database/games";
import { Service } from "typedi";

import { LibraryActions } from "../sync/types";
import { EpicGamesStoreLibraryService } from "./epic-games-store/epic-game-store-library.service";
import { SteamLibraryService } from "./steam/steam-library.service";

@Service()
export class LibraryRegistryService {
  constructor(
    private epicGamesStoreLibraryService: EpicGamesStoreLibraryService,
    private steamLibraryService: SteamLibraryService,
  ) {}

  getLibraryImplementation(library: Library): LibraryActions | undefined {
    switch (library) {
      case "epic-game-store":
        return this.epicGamesStoreLibraryService;
      case "steam":
        return this.steamLibraryService;
      default:
        return undefined;
    }
  }
}
