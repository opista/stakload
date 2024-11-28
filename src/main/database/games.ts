import path from "node:path";

import { GameStoreModel, InitialGameStoreModel, Library } from "@contracts/database/games";
import { app } from "electron";
import Datastore from "nedb-promises";

const db = Datastore.create({
  autoload: true,
  filename: path.join(app.getPath("userData"), "databases", "games.db"),
  timestampData: true,
});

export const bulkInsertGames = async (games: InitialGameStoreModel[]) => {
  return await db.insertMany<Omit<GameStoreModel, "_id">>(games);
};

export const addGame = async (game: InitialGameStoreModel) => {
  /**
   * TODO
   * When we add a game we need to trigger something
   * to go and perform a sync
   */
  return await db.insert<Omit<GameStoreModel, "_id">>(game);
};

export const findUnsyncedGames = async () => {
  return await db.find<GameStoreModel>({ metadataSyncedAt: { $exists: false } }).sort({ name: 1 });
};

// TODO
export const getFilteredGames = async () => {
  return await db
    .find<GameStoreModel>({ $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] })
    .sort({ name: 1 });
};

export const findGameById = async (id: string) => {
  return await db.findOne<GameStoreModel>({ _id: id });
};

export const findLastSyncedAt = async () => {
  /**
   * TODO - Is this right? Might need to spend
   * some more time looking at this. What if a user
   * adds a game manually? Does that count as a sync?
   */
  const mostRecentlyCreated = await db.findOne<GameStoreModel>({}).sort({ createdAt: -1 });
  const mostRecentlySynced = await db.findOne<GameStoreModel>({}).sort({ metadataSyncedAt: -1 });

  const mostRecent = Math.max(
    mostRecentlyCreated?.createdAt?.getTime() || 0,
    mostRecentlySynced?.metadataSyncedAt?.getTime() || 0,
  );

  if (!mostRecent) {
    return null;
  }

  return new Date(mostRecent);
};

export const updateGameById = async (id: string, updates: Partial<Omit<GameStoreModel, "createdAt">>) => {
  return await db.update<GameStoreModel>({ _id: id }, { $set: updates }, { returnUpdatedDocs: true });
};

export const updateGameByGameId = async (gameId: string, updates: Partial<Omit<GameStoreModel, "createdAt">>) => {
  return await db.update<GameStoreModel>({ gameId }, { $set: updates }, { returnUpdatedDocs: true });
};

export const removeGameById = async (id: string, preventReadd: boolean = false) => {
  try {
    if (preventReadd) {
      await updateGameById(id, { deletedAt: new Date() });
      return true;
    } else {
      await db.deleteOne({ _id: id }, { multi: false });
      return true;
    }
  } catch (err) {
    // TODO error logging
    return false;
  }
};

export const findGamesByGameIds = async (ids: string[], library: Library) => {
  return await db.find({ gameId: { $in: ids }, library }, { gameId: 1, _id: 0 });
};
