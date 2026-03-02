import { Module } from "@nestjs/common";

import { BattleNetModule } from "../../integrations/battle-net/battle-net.module";
import { EpicGamesModule } from "../../integrations/epic-games-store/epic-games-store.module";
import { GogModule } from "../../integrations/gog/gog.module";
import { SteamModule } from "../../integrations/steam/steam.module";
import { SyncRegistryService } from "./sync-registry.service";

@Module({
  exports: [SyncRegistryService],
  imports: [BattleNetModule, EpicGamesModule, GogModule, SteamModule],
  providers: [SyncRegistryService],
})
export class SyncRegistryModule {}
