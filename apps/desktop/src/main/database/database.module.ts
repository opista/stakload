import path from "path";
import { mkdirSync } from "fs";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { app } from "electron";

import { CollectionEntity } from "../collection/collection.entity";
import { GameEntity } from "../game/game.entity";
import { APP_DIR_NAME } from "../app-paths";

const databaseDirectory = path.join(app.getPath("appData"), `${APP_DIR_NAME}-data`, "databases");
mkdirSync(databaseDirectory, { recursive: true });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: path.join(databaseDirectory, "stakload.db"),
      entities: [GameEntity, CollectionEntity],
      synchronize: true,
      type: "better-sqlite3",
    }),
  ],
})
export class DatabaseModule {}
