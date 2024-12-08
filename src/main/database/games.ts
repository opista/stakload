import path from "node:path";

import { GameFilters, GameStoreModel, InitialGameStoreModel, Library } from "@contracts/database/games";
import { app } from "electron";
import Datastore from "nedb-promises";

import { idMatcher } from "../libraries/steam/util/database-id-matcher";

const db = Datastore.create({
  autoload: true,
  filename: path.join(app.getPath("userData"), "databases", "games.db"),
  compareStrings: (a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  },
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

export const getFilteredGames = async ({
  developers,
  gameModes,
  genres,
  playerPerspectives,
  publishers,
}: GameFilters = {}) => {
  console.log({
    developers,
    gameModes,
    genres,
    playerPerspectives,
    publishers,
  });
  return await db
    .find<GameStoreModel>({
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      ...idMatcher("developers", developers),
      ...idMatcher("gameModes", gameModes),
      ...idMatcher("genres", genres),
      ...idMatcher("playerPerspectives", playerPerspectives),
      ...idMatcher("publishers", publishers),
    })
    .sort({ sortableName: 1 });
};

export const findGameById = async (id: string) => {
  return await db.findOne<GameStoreModel>({ _id: id });
};

export const findLastSyncedAt = async () => {
  /**
   * TODO - Is this right? Might need to spend
   * some more time looking at this. What if a user
   * adds a game manually? Does that count as a sync?
   * createdAt means document added, metadataSyncedAt
   * means document enriched
   */
  const mostRecentDoc = await db
    .findOne<GameStoreModel>({
      $or: [{ createdAt: { $exists: true } }, { metadataSyncedAt: { $exists: true } }],
    })
    .sort({
      createdAt: -1,
      metadataSyncedAt: -1,
    });

  if (!mostRecentDoc) {
    return null;
  }

  const mostRecent = Math.max(mostRecentDoc.createdAt?.getTime() || 0, mostRecentDoc.metadataSyncedAt?.getTime() || 0);

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

export const findGameFilters = async () => {
  const filterableFields: (keyof GameStoreModel)[] = [
    "developers",
    "gameModes",
    "genres",
    "playerPerspectives",
    "publishers",
  ];
  const games = await db.find({});

  const uniqueValuesMap: { [key: string]: Map<string, string> } = filterableFields.reduce((acc, field) => {
    acc[field] = new Map();
    return acc;
  }, {});

  for (const document of games) {
    for (const field of filterableFields) {
      const items = document[field];
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item.id && item.name) {
            // Use ID as the key for uniqueness
            uniqueValuesMap[field].set(item.id, item.name);
          }
        }
      }
    }
  }

  const results = filterableFields.reduce((acc, field) => {
    acc[field] = Array.from(uniqueValuesMap[field].entries())
      .map(([id, name]) => ({
        label: name,
        value: id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    return acc;
  }, {});

  return results;
};
