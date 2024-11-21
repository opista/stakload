const PARENT_KEY = "games";
import { db } from "./index";

export type Library = "steam";
export type Platform = "linux" | "max" | "windows";

export type GameStoreModel = {
  backgroundImage?: string;
  createdAt: Date;
  deletedAt?: Date;
  description?: string;
  listImage?: string;
  icon?: string;
  id: string;
  gameId: string;
  library: Library;
  metadataSyncedAt?: Date;
  name: string;
  platform?: Platform[];
  type?: "app" | "game";
  updatedAt?: Date;
};

export type InitialGameStoreModel = Pick<GameStoreModel, "gameId" | "icon" | "id" | "library" | "name">;

export const bulkInsertGames = async (games: InitialGameStoreModel[]) => {
  const mapped = games.reduce<Record<string, Partial<GameStoreModel>>>(
    (acc, fields) => ({
      ...acc,
      [fields.id]: {
        ...fields,
        createdAt: new Date(),
      },
    }),
    {},
  );

  const snapshots = await db.ref<GameStoreModel>(PARENT_KEY).update(mapped);

  if (!snapshots.exists()) {
    throw new Error("Games not found");
  }

  return findUnsyncedGames();
};

export const addGame = async (fields: Pick<GameStoreModel, "gameId" | "icon" | "library" | "name">) => {
  const ref = await db.ref<GameStoreModel>(PARENT_KEY).push({
    ...fields,
    createdAt: new Date(),
  });

  const snapshot = await ref.get();

  return snapshot.val();
};

export const findUnsyncedGames = async () => {
  const snapshots = await db.query(PARENT_KEY).filter("metadataSyncedAt", "!exists").get<GameStoreModel>();
  return snapshots.getValues();
};

// TODO
export const getFilteredGames = async () => {
  const snapshots = await db.ref(PARENT_KEY).query().take(Infinity).sort("name").get<GameStoreModel>();
  return snapshots.getValues();
};

export const updateGame = async (id: string, updates: Partial<Omit<GameStoreModel, "createdAt">>) => {
  const ref = await db.ref<GameStoreModel>(`${PARENT_KEY}/${id}`).update({
    ...updates,
    updatedAt: new Date(),
  });

  const snapshot = await ref.get();

  if (!snapshot.exists()) {
    throw new Error("Game not found");
  }

  return snapshot.val();
};

export const removeGame = async (id: string, permanent: boolean = false) => {
  if (permanent) {
    await updateGame(id, { deletedAt: new Date() });
    return true;
  } else {
    await db.ref<GameStoreModel>(`${PARENT_KEY}/${id}`).remove();
    return true;
  }
};
