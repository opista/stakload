import { Module } from "@nestjs/common";

import { CollectionModule } from "./collection/collection.module";
import { ConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { GameModule } from "./game/game.module";
import { GameLifecycleModule } from "./game-lifecycle/game-lifecycle.module";
import { LoggingModule } from "./logging/logging.module";
import { SyncModule } from "./sync/sync.module";
import { SystemModule } from "./system/system.module";
import { WindowModule } from "./window/window.module";

@Module({
  imports: [
    DatabaseModule,
    GameLifecycleModule,
    ConfigModule,
    LoggingModule,
    CollectionModule,
    GameModule,
    SyncModule,
    SystemModule,
    WindowModule,
  ],
})
export class IpcModule {}
