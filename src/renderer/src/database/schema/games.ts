import { EntityTable } from "dexie";

export type Library = "steam";
export type Platform = "linux" | "max" | "windows";

export type GameStoreModel = {
  backgroundImage?: string;
  description?: string;
  listImage?: string;
  icon?: string;
  id: string;
  gameId: string;
  library: Library;
  metadataSyncedAt: Date | 0;
  name: string;
  platform?: Platform[];
  type?: "app" | "game";
};

export type GameEntityTable = EntityTable<GameStoreModel, "id">;

const index = "++id, metadataSyncedAt, name";

export default index;
