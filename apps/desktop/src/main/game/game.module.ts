import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CollectionModule } from "../collection/collection.module";
import { GameLifecycleModule } from "../game-lifecycle/game-lifecycle.module";
import { ProtonDBModule } from "../protondb/protondb.module";
import { StackloadAPIModule } from "../stackload-api/stackload-api.module";
import { WindowModule } from "../window/window.module";
import { GameController } from "./game.controller";
import { GameEntity } from "./game.entity";
import { GameService } from "./game.service";
import { GameStore } from "./game.store";

@Module({
  controllers: [GameController],
  exports: [GameService, GameStore],
  imports: [
    CollectionModule,
    forwardRef(() => GameLifecycleModule),
    TypeOrmModule.forFeature([GameEntity]),
    ProtonDBModule,
    StackloadAPIModule,
    WindowModule,
  ],
  providers: [GameService, GameStore],
})
export class GameModule {}
