import { forwardRef, Module } from "@nestjs/common";

import { GameModule } from "../../game/game.module";
import { StackloadAPIModule } from "../../stackload-api/stackload-api.module";
import { WindowModule } from "../../window/window.module";

import { SteamApiService } from "./api/steam-api.service";
import { SteamClientService } from "./client/steam-client.service";
import { InstalledGamesRegistryService } from "./installed-games/installed-games-registry.service";
import { MacInstalledGamesStrategy } from "./installed-games/strategies/mac.strategy";
import { WindowsInstalledGamesStrategy } from "./installed-games/strategies/windows.strategy";
import { SteamLibraryService } from "./sync/steam-sync.service";

@Module({
  exports: [SteamLibraryService, SteamClientService],
  imports: [forwardRef(() => GameModule), StackloadAPIModule, WindowModule],
  providers: [
    SteamApiService,
    SteamClientService,
    SteamLibraryService,
    InstalledGamesRegistryService,
    MacInstalledGamesStrategy,
    WindowsInstalledGamesStrategy,
  ],
})
export class SteamModule {}
