import { forwardRef, Module } from "@nestjs/common";

import { GameModule } from "../../game/game.module";
import { StackloadAPIModule } from "../../stackload-api/stackload-api.module";
import { WindowModule } from "../../window/window.module";

import { EpicGamesStoreApiService } from "./api/epic-games-store-api.service";
import { EpicGamesStoreClientService } from "./client/epic-games-store-client.service";
import { InstalledGamesRegistryService } from "./installed-games/installed-games-registry.service";
import { MacInstalledGamesStrategy } from "./installed-games/strategies/mac.strategy";
import { WindowsInstalledGamesStrategy } from "./installed-games/strategies/windows.strategy";
import { LegendaryService } from "./legendary/legendary.service";
import { EpicGamesStoreSyncService } from "./sync/epic-games-store-sync.service";

@Module({
  exports: [EpicGamesStoreSyncService, EpicGamesStoreClientService],
  imports: [forwardRef(() => GameModule), StackloadAPIModule, WindowModule],
  providers: [
    EpicGamesStoreApiService,
    EpicGamesStoreClientService,
    EpicGamesStoreSyncService,
    InstalledGamesRegistryService,
    LegendaryService,
    MacInstalledGamesStrategy,
    WindowsInstalledGamesStrategy,
  ],
})
export class EpicGamesModule {}
