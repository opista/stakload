import { Module } from "@nestjs/common";

import { GameStore } from "./game.store";

@Module({
  exports: [GameStore],
  providers: [GameStore],
})
export class GameStoreModule {}
