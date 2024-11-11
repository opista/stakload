import { addRxPlugin, createRxDatabase } from "rxdb";
import { gameSchema } from "./schema/game.schema";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

let dbPromise: ReturnType<typeof _create> | null = null;

export const _create = async () => {
  if (process.env.NODE_ENV === "development") {
    console.log("Dev mode db baby!!");
    await import("rxdb/plugins/dev-mode").then((module) =>
      addRxPlugin(module.RxDBDevModePlugin)
    );
  }

  const db = await createRxDatabase({
    eventReduce: true,
    ignoreDuplicate: false,
    multiInstance: false,
    name: "test_database",
    password: "123", // TODO
    storage: getRxStorageDexie(),
  });

  await db.addCollections({
    games: {
      schema: gameSchema,
    },
  });

  return db;
};

export const initialize = () => {
  if (!dbPromise) {
    dbPromise = _create();
  }

  return dbPromise;
};
