import { forwardRef, Module } from "@nestjs/common";

import { GameModule } from "../../game/game.module";
import { resolvePlatformImplementation } from "../../platform/resolve-platform-implementation";
import { StackloadAPIModule } from "../../stackload-api/stackload-api.module";
import { WindowModule } from "../../window/window.module";
import { SteamApiService } from "./api/steam-api.service";
import { SteamClientService } from "./client/steam-client.service";
import { MacInstalledGamesStrategy } from "./installed-games/strategies/mac.strategy";
import { WindowsInstalledGamesStrategy } from "./installed-games/strategies/windows.strategy";
import { InstalledGamesStrategy, STEAM_INSTALLED_GAMES_STRATEGY } from "./installed-games/types";
import { SteamSyncWorkerService } from "./sync/steam-sync-worker.service";
import { SteamLibraryService } from "./sync/steam-sync.service";

@Module({
  exports: [SteamLibraryService, SteamClientService, SteamSyncWorkerService],
  imports: [forwardRef(() => GameModule), StackloadAPIModule, WindowModule],
  providers: [
    SteamApiService,
    SteamClientService,
    SteamLibraryService,
    SteamSyncWorkerService,
    MacInstalledGamesStrategy,
    WindowsInstalledGamesStrategy,
    {
      inject: [MacInstalledGamesStrategy, WindowsInstalledGamesStrategy],
      provide: STEAM_INSTALLED_GAMES_STRATEGY,
      useFactory: (
        macInstalledGamesStrategy: MacInstalledGamesStrategy,
        windowsInstalledGamesStrategy: WindowsInstalledGamesStrategy,
      ): InstalledGamesStrategy =>
        resolvePlatformImplementation<InstalledGamesStrategy>("Steam installed games", {
          darwin: macInstalledGamesStrategy,
          win32: windowsInstalledGamesStrategy,
        }),
    },
  ],
})
export class SteamModule {}
