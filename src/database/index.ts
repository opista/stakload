import Dexie, { type EntityTable } from "dexie";

interface GameStoreModel {
  id: string;
  _id: string;
  appId: string;
  name: string;
  platform: string;
}

const db = new Dexie("trulaunch") as Dexie & {
  games: EntityTable<GameStoreModel, "id">;
};

// Schema declaration:
db.version(1).stores({
  games: "++id", // primary key "id" (for the runtime!)
});

export type { GameStoreModel };
export { db };
