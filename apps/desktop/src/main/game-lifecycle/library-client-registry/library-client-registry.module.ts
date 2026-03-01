import { Module } from "@nestjs/common";

import { BattleNetModule } from "../../integrations/battle-net/battle-net.module";
import { EpicGamesModule } from "../../integrations/epic-games-store/epic-games-store.module";
import { GogModule } from "../../integrations/gog/gog.module";
import { SteamModule } from "../../integrations/steam/steam.module";

import { LibraryClientRegistryService } from "./library-client-registry.service";

@Module({
  exports: [LibraryClientRegistryService],
  imports: [BattleNetModule, EpicGamesModule, GogModule, SteamModule],
  providers: [LibraryClientRegistryService],
})
export class LibraryClientRegistryModule {}
