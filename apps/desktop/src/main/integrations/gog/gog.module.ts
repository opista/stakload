import { forwardRef, Module } from "@nestjs/common";

import { GameModule } from "../../game/game.module";
import { StackloadAPIModule } from "../../stackload-api/stackload-api.module";
import { WindowModule } from "../../window/window.module";

import { GogApiService } from "./api/gog-api.service";
import { GogClientService } from "./client/gog-client.service";
import { InstalledGamesRegistryService } from "./installed-games/installed-games-registry.service";
import { MacInstalledGamesStrategy } from "./installed-games/strategies/mac.strategy";
import { WindowsInstalledGamesStrategy } from "./installed-games/strategies/windows.strategy";
import { GogLibraryService } from "./sync/gog-sync.service";

@Module({
  exports: [GogLibraryService, GogClientService],
  imports: [forwardRef(() => GameModule), StackloadAPIModule, WindowModule],
  providers: [
    GogApiService,
    GogClientService,
    GogLibraryService,
    InstalledGamesRegistryService,
    MacInstalledGamesStrategy,
    WindowsInstalledGamesStrategy,
  ],
})
export class GogModule {}
