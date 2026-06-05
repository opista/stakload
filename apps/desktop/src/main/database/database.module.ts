import { mkdirSync } from "fs";
import path from "path";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { app } from "electron";

import { APP_DIR_NAME } from "../app-paths";
import { CollectionEntity } from "../collection/collection.entity";
import { GameEntity } from "../game/game.entity";

const resolveDatabasePath = () => {
  const databaseDirectory = path.join(app.getPath("appData"), `${APP_DIR_NAME}-data`, "databases");
  mkdirSync(databaseDirectory, { recursive: true });
  return path.join(databaseDirectory, "stakload.db");
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        await app.whenReady();
        return {
          database: resolveDatabasePath(),
          entities: [GameEntity, CollectionEntity],
          synchronize: true,
          type: "better-sqlite3",
        };
      },
    }),
  ],
})
export class DatabaseModule {}
