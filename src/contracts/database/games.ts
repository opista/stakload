export type Library = "steam";
export type Platform = "linux" | "mac" | "windows";

export type GameStoreModel = {
  _id: string;
  backgroundImage?: string;
  deletedAt?: Date;
  description?: string;
  listImage?: string;
  icon?: string;
  gameId: string;
  lastPlayedAt?: Date;
  library: Library;
  metadataSyncedAt?: Date;
  name: string;
  platform?: Platform[];
  type?: "app" | "game";
};

export type InitialGameStoreModel = Pick<GameStoreModel, "gameId" | "icon" | "library" | "name">;
