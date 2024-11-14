import Dexie, { type EntityTable } from "dexie";

interface GameStoreModel {
  id: string;
  gameId: string;
  metadataSyncedAt: Date | 0;
  name: string;
  platform: string;
}

const db = new Dexie("trulaunch") as Dexie & {
  games: EntityTable<GameStoreModel, "id">;
};

// Schema declaration:
db.version(1).stores({
  games: "++id, metadataSyncedAt",
});

export type { GameStoreModel };
export { db };
