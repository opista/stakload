import { forwardRef, Module } from "@nestjs/common";

import { CollectionModule } from "../collection/collection.module";
import { GameLifecycleModule } from "../game-lifecycle/game-lifecycle.module";
import { ProtonDBModule } from "../protondb/protondb.module";
import { StackloadAPIModule } from "../stackload-api/stackload-api.module";
import { WindowModule } from "../window/window.module";

import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { GameStoreModule } from "./game-store.module";

@Module({
  controllers: [GameController],
  exports: [GameService, GameStoreModule],
  imports: [
    CollectionModule,
    forwardRef(() => GameLifecycleModule),
    GameStoreModule,
    ProtonDBModule,
    StackloadAPIModule,
    WindowModule,
  ],
  providers: [GameService],
})
export class GameModule {}
