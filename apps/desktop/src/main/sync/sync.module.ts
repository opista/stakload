import { Module } from "@nestjs/common";

import { GameModule } from "../game/game.module";
import { NotificationModule } from "../notification/notification.module";
import { WindowModule } from "../window/window.module";

import { SyncController } from "./sync.controller";
import { SyncService } from "./sync.service";
import { SyncRegistryModule } from "./sync-registry/sync-registry.module";

@Module({
  controllers: [SyncController],
  exports: [SyncService],
  imports: [GameModule, NotificationModule, WindowModule, SyncRegistryModule],
  providers: [SyncService],
})
export class SyncModule {}
