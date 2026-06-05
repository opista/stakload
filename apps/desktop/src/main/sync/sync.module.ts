import { Module } from "@nestjs/common";

import { GameModule } from "../game/game.module";
import { SteamModule } from "../integrations/steam/steam.module";
import { NotificationModule } from "../notification/notification.module";
import { StackloadAPIModule } from "../stackload-api/stackload-api.module";
import { WindowModule } from "../window/window.module";
import { SyncRegistryModule } from "./sync-registry/sync-registry.module";
import { SyncController } from "./sync.controller";
import { SyncService } from "./sync.service";

@Module({
  controllers: [SyncController],
  exports: [SyncService],
  imports: [GameModule, NotificationModule, StackloadAPIModule, WindowModule, SyncRegistryModule, SteamModule],
  providers: [SyncService],
})
export class SyncModule {}
