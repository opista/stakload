import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { app } from "electron";

import { APP_DIR_NAME, userDataPath } from "../app-paths";
import { CollectionEntity } from "../collection/collection.entity";
import { GameEntity } from "../game/game.entity";

const DATABASE_DIRECTORY_NAME = "databases";
const DATABASE_FILE_NAME = "stakload.db";

const copyTemporaryDatabaseIfNeeded = (databasePath: string) => {
  const temporaryDatabasePath = path.join(
    path.dirname(userDataPath),
    `${APP_DIR_NAME}-data`,
    DATABASE_DIRECTORY_NAME,
    DATABASE_FILE_NAME,
  );

  if (existsSync(databasePath) || !existsSync(temporaryDatabasePath)) return;

  copyFileSync(temporaryDatabasePath, databasePath);
};

const resolveDatabasePath = () => {
  const databaseDirectory = path.join(userDataPath, DATABASE_DIRECTORY_NAME);
  mkdirSync(databaseDirectory, { recursive: true });
  const databasePath = path.join(databaseDirectory, DATABASE_FILE_NAME);
  copyTemporaryDatabaseIfNeeded(databasePath);
  return databasePath;
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
