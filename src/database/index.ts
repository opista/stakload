import Dexie, { type EntityTable } from "dexie";

export type Library = "steam";
export type Platform = "linux" | "max" | "windows";

interface GameStoreModel {
  backgroundImage?: string;
  listImage?: string;
  icon?: string;
  id: string;
  gameId: string;
  library: Library;
  metadataSyncedAt: Date | 0;
  name: string;
  platform?: Platform[];
  type?: "app" | "game";
}

const db = new Dexie("trulaunch") as Dexie & {
  games: EntityTable<GameStoreModel, "id">;
};

// Schema declaration:
db.version(1).stores({
  games: "++id, metadataSyncedAt, name",
});

export type { GameStoreModel };
export { db };
