import { forwardRef, Module } from "@nestjs/common";

import { GameModule } from "../../game/game.module";
import { resolvePlatformImplementation } from "../../platform/resolve-platform-implementation";
import { StackloadAPIModule } from "../../stackload-api/stackload-api.module";
import { WindowModule } from "../../window/window.module";
import { EpicGamesStoreApiService } from "./api/epic-games-store-api.service";
import { EpicGamesStoreClientService } from "./client/epic-games-store-client.service";
import { MacInstalledGamesStrategy } from "./installed-games/strategies/mac.strategy";
import { WindowsInstalledGamesStrategy } from "./installed-games/strategies/windows.strategy";
import {
  EPIC_GAMES_STORE_INSTALLED_GAMES_STRATEGY,
  InstalledGamesStrategy,
} from "./installed-games/types";
import { LegendaryService } from "./legendary/legendary.service";
import { EpicGamesStoreSyncService } from "./sync/epic-games-store-sync.service";

@Module({
  exports: [EpicGamesStoreSyncService, EpicGamesStoreClientService],
  imports: [forwardRef(() => GameModule), StackloadAPIModule, WindowModule],
  providers: [
    EpicGamesStoreApiService,
    EpicGamesStoreClientService,
    EpicGamesStoreSyncService,
    LegendaryService,
    MacInstalledGamesStrategy,
    WindowsInstalledGamesStrategy,
    {
      inject: [MacInstalledGamesStrategy, WindowsInstalledGamesStrategy],
      provide: EPIC_GAMES_STORE_INSTALLED_GAMES_STRATEGY,
      useFactory: (
        macInstalledGamesStrategy: MacInstalledGamesStrategy,
        windowsInstalledGamesStrategy: WindowsInstalledGamesStrategy,
      ): InstalledGamesStrategy =>
        resolvePlatformImplementation<InstalledGamesStrategy>("Epic Games Store installed games", {
          darwin: macInstalledGamesStrategy,
          win32: windowsInstalledGamesStrategy,
        }),
    },
  ],
})
export class EpicGamesModule {}
