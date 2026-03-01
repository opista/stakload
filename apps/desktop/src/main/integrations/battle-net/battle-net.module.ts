import { forwardRef, Module } from "@nestjs/common";

import { GameModule } from "../../game/game.module";
import { StackloadAPIModule } from "../../stackload-api/stackload-api.module";
import { WindowModule } from "../../window/window.module";

import { BattleNetApiService } from "./api/battle-net-api.service";
import { BattleNetClientService } from "./client/battle-net-client.service";
import { InstalledGamesRegistryService } from "./installed-games/installed-games-registry.service";
import { MacInstalledGamesStrategy } from "./installed-games/strategies/mac.strategy";
import { WindowsInstalledGamesStrategy } from "./installed-games/strategies/windows.strategy";
import { BattleNetLibraryService } from "./sync/battle-net-sync.service";

@Module({
  exports: [BattleNetLibraryService, BattleNetClientService],
  imports: [forwardRef(() => GameModule), StackloadAPIModule, WindowModule],
  providers: [
    BattleNetApiService,
    BattleNetClientService,
    BattleNetLibraryService,
    InstalledGamesRegistryService,
    MacInstalledGamesStrategy,
    WindowsInstalledGamesStrategy,
  ],
})
export class BattleNetModule {}
