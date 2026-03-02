import { forwardRef, Module } from "@nestjs/common";

import { GameModule } from "../game/game.module";
import { NotificationModule } from "../notification/notification.module";
import { ProcessMonitorModule } from "../process-monitor/process-monitor.module";
import { WindowModule } from "../window/window.module";
import { GameLifecycleService } from "./game-lifecycle.service";
import { LibraryClientRegistryModule } from "./library-client-registry/library-client-registry.module";

@Module({
  exports: [GameLifecycleService],
  imports: [
    forwardRef(() => GameModule),
    NotificationModule,
    ProcessMonitorModule,
    WindowModule,
    LibraryClientRegistryModule,
  ],
  providers: [GameLifecycleService],
})
export class GameLifecycleModule {}
