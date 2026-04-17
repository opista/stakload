import { forwardRef, Module } from "@nestjs/common";

import { GameModule } from "../../game/game.module";
import { resolvePlatformImplementation } from "../../platform/resolve-platform-implementation";
import { StackloadAPIModule } from "../../stackload-api/stackload-api.module";
import { WindowModule } from "../../window/window.module";
import { GogApiService } from "./api/gog-api.service";
import { GogClientService } from "./client/gog-client.service";
import { MacInstalledGamesStrategy } from "./installed-games/strategies/mac.strategy";
import { WindowsInstalledGamesStrategy } from "./installed-games/strategies/windows.strategy";
import { GOG_INSTALLED_GAMES_STRATEGY, InstalledGamesStrategy } from "./installed-games/types";
import { GogLibraryService } from "./sync/gog-sync.service";

@Module({
  exports: [GogLibraryService, GogClientService],
  imports: [forwardRef(() => GameModule), StackloadAPIModule, WindowModule],
  providers: [
    GogApiService,
    GogClientService,
    GogLibraryService,
    MacInstalledGamesStrategy,
    WindowsInstalledGamesStrategy,
    {
      inject: [MacInstalledGamesStrategy, WindowsInstalledGamesStrategy],
      provide: GOG_INSTALLED_GAMES_STRATEGY,
      useFactory: (
        macInstalledGamesStrategy: MacInstalledGamesStrategy,
        windowsInstalledGamesStrategy: WindowsInstalledGamesStrategy,
      ): InstalledGamesStrategy =>
        resolvePlatformImplementation<InstalledGamesStrategy>("GOG installed games", {
          darwin: macInstalledGamesStrategy,
          win32: windowsInstalledGamesStrategy,
        }),
    },
  ],
})
export class GogModule {}
