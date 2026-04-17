import { forwardRef, Module } from "@nestjs/common";

import { GameModule } from "../../game/game.module";
import { resolvePlatformImplementation } from "../../platform/resolve-platform-implementation";
import { StackloadAPIModule } from "../../stackload-api/stackload-api.module";
import { WindowModule } from "../../window/window.module";
import { BattleNetApiService } from "./api/battle-net-api.service";
import { BattleNetClientService } from "./client/battle-net-client.service";
import { MacInstalledGamesStrategy } from "./installed-games/strategies/mac.strategy";
import { WindowsInstalledGamesStrategy } from "./installed-games/strategies/windows.strategy";
import { BATTLE_NET_INSTALLED_GAMES_STRATEGY, InstalledGamesStrategy } from "./installed-games/types";
import { BattleNetLibraryService } from "./sync/battle-net-sync.service";

@Module({
  exports: [BattleNetLibraryService, BattleNetClientService],
  imports: [forwardRef(() => GameModule), StackloadAPIModule, WindowModule],
  providers: [
    BattleNetApiService,
    BattleNetClientService,
    BattleNetLibraryService,
    MacInstalledGamesStrategy,
    WindowsInstalledGamesStrategy,
    {
      inject: [MacInstalledGamesStrategy, WindowsInstalledGamesStrategy],
      provide: BATTLE_NET_INSTALLED_GAMES_STRATEGY,
      useFactory: (
        macInstalledGamesStrategy: MacInstalledGamesStrategy,
        windowsInstalledGamesStrategy: WindowsInstalledGamesStrategy,
      ): InstalledGamesStrategy =>
        resolvePlatformImplementation<InstalledGamesStrategy>("Battle.net installed games", {
          darwin: macInstalledGamesStrategy,
          win32: windowsInstalledGamesStrategy,
        }),
    },
  ],
})
export class BattleNetModule {}
