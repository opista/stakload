/**
 * TODO - This should be a shared contract between
 * the backend and frontend
 */

export type Library = "steam";
export type Platform = "linux" | "mac" | "windows";

export type GameStoreModel = {
  _id: string;
  backgroundImage?: string;
  createdAt: Date;
  deletedAt?: Date;
  description?: string;
  lastPlayedAt?: Date;
  listImage?: string;
  icon?: string;
  gameId: string;
  library: Library;
  metadataSyncedAt?: Date;
  name: string;
  platform?: Platform[];
  type?: "app" | "game";
  updatedAt?: Date;
};
