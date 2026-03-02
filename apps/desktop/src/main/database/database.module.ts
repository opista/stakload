import path from "path";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { app } from "electron";

import { CollectionEntity } from "../collection/collection.entity";
import { GameEntity } from "../game/game.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: path.join(app.getPath("userData"), "databases", "stakload.db"),
      entities: [GameEntity, CollectionEntity],
      synchronize: true,
      type: "better-sqlite3",
    }),
  ],
})
export class DatabaseModule {}
