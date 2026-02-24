import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";

import { CollectionEntity } from "../collection/collection.entity";
import { DATABASE_PATH } from "../constants";
import { GameEntity } from "../game/game.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: path.join(DATABASE_PATH, "stakload.db"),
      entities: [GameEntity, CollectionEntity],
      synchronize: true,
      type: "better-sqlite3",
    }),
  ],
})
export class DatabaseModule {}
