import {
  FeaturedGameModel,
  GameFilters,
  GameListModel,
  GameStoreModel,
  InitialGameStoreModel,
  LikeLibrary,
} from "@contracts/database/games";

import { createDb } from "./util/create-db";
import { idMatcher } from "./util/database-id-matcher";

const db = createDb("games");

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
  ageRatings,
  developers,
  gameModes,
  genres,
  isInstalled,
  libraries,
  platforms,
  playerPerspectives,
  publishers,
}: GameFilters = {}) => {
  return await db
    .find<GameListModel>(
      {
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
        ...(ageRatings?.length && { ageRating: { $in: ageRatings } }),
        ...(isInstalled != undefined && { isInstalled }),
        ...(libraries?.length && { library: { $in: libraries } }),
        ...idMatcher("developers", developers),
        ...idMatcher("gameModes", gameModes),
        ...idMatcher("genres", genres),
        ...idMatcher("platforms", platforms),
        ...idMatcher("playerPerspectives", playerPerspectives),
        ...idMatcher("publishers", publishers),
      },
      { _id: 1, cover: 1, name: 1 },
    )
    .sort({ sortableName: 1 });
};

export const findGameById = async (id: string) => {
  return await db.findOne<GameStoreModel>({ _id: id });
};

export const findGamesByEpicNamespace = async (ids: string[]) => {
  return await db.find<GameStoreModel>({ library: "epic-game-store", "libraryMeta.namespace": { $in: ids } });
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

export const findGamesByGameIds = async (ids: string[], library: LikeLibrary) => {
  return await db.find({ gameId: { $in: ids }, library }, { _id: 0, gameId: 1 });
};

export const findGameFilters = async () => {
  const filterableFields: (keyof GameStoreModel)[] = [
    "developers",
    "gameModes",
    "genres",
    "platforms",
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

export const getGamesList = async () => {
  return await db
    .find<GameListModel>(
      { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
      { _id: 1, cover: 1, name: 1 },
    )
    .sort({ sortableName: 1 });
};

export const getNewGames = async () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // First try to get games added in the last week
  const recentGames = await db
    .find<FeaturedGameModel>(
      {
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
        createdAt: { $gte: oneWeekAgo },
      },
      { _id: 1, genres: 1, name: 1, screenshots: 1, summary: 1 },
    )
    .sort({ createdAt: -1 })
    .limit(10);

  // If we don't have enough recent games, fetch more based on createdAt
  if (recentGames.length < 3) {
    const remainingGames = await db
      .find<FeaturedGameModel>(
        {
          $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          createdAt: { $lt: oneWeekAgo },
        },
        { _id: 1, genres: 1, name: 1, screenshots: 1, summary: 1 },
      )
      .sort({ createdAt: -1 })
      .limit(3 - recentGames.length);

    return [...recentGames, ...remainingGames];
  }

  return recentGames;
};

export const getQuickLaunchGames = async () => {
  return await db.find<GameListModel>(
    {
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      quickLaunch: true,
    },
    { _id: 1, cover: 1, name: 1 },
  );
};

export const toggleQuickLaunchGame = async (id: string) => {
  const game = await findGameById(id);
  return await updateGameById(id, { quickLaunch: !game?.quickLaunch });
};
