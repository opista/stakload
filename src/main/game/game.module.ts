import { LaunchModule } from "../launch/launch.module";
import { Module } from "../util/module/module.decorator";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { GameStore } from "./game.store";

@Module({
  imports: [LaunchModule],
  providers: [GameService, GameStore, GameController],
})
export class GameModule {}
