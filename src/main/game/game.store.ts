import { FeaturedGameModel, GameFilters, GameListModel, GameStoreModel, Library } from "@contracts/database/games";
import { createDb } from "@util/database/create-db";
import { dateRangeMatcher } from "@util/database/date-range-matcher";
import { idMatcher } from "@util/database/id-matcher";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";

type FieldsType = "all" | "featured" | "list";

type Sort = {
  direction: 1 | -1;
  field: keyof GameStoreModel;
};

const fieldsMap: Record<FieldsType, Partial<Record<keyof GameStoreModel, number>> | undefined> = {
  all: undefined,
  featured: { _id: 1, genres: 1, name: 1, screenshots: 1, summary: 1 },
  list: { _id: 1, cover: 1, library: 1, name: 1 },
};

const db = createDb("games");
@Service()
export class GameStore {
  constructor(private readonly logger: LoggerService) {}

  async bulkInsertGames(games: Partial<GameStoreModel>[]) {
    this.logger.debug("Attempting bulk insert of games", { count: games.length });
    try {
      const result = await db.insertMany<Partial<GameStoreModel>>(games);
      this.logger.debug("Successfully bulk inserted games", { count: result.length });
      return result;
    } catch (error) {
      this.logger.error("Database error while bulk inserting games", error, { count: games.length });
      throw error;
    }
  }

  async insertGame(game: Partial<GameStoreModel>) {
    return await db.insert<Partial<GameStoreModel>>(game);
  }

  async findFilteredGames<T extends FieldsType = "all">(
    filters: GameFilters = {},
    type: T = "all" as T,
    sort: Sort = { field: "sortableName", direction: 1 },
    limit?: number,
  ) {
    this.logger.debug("Finding filtered games", { filters, type, sort, limit });
    try {
      const results = await db
        .find(
          {
            $or: [{ archivedAt: null }, { archivedAt: { $exists: false } }],
            ...(filters.ageRatings?.length && { ageRating: { $in: filters.ageRatings } }),
            ...(filters.isFavourite != undefined && { isFavourite: filters.isFavourite }),
            ...(filters.isInstalled != undefined && { isInstalled: filters.isInstalled }),
            ...(filters.isQuickLaunch != undefined && { isQuickLaunch: filters.isQuickLaunch }),
            ...(filters.libraries?.length && { library: { $in: filters.libraries } }),
            ...dateRangeMatcher("createdAt", filters.createdAt),
            ...idMatcher("developers", filters.developers),
            ...idMatcher("gameModes", filters.gameModes),
            ...idMatcher("genres", filters.genres),
            ...idMatcher("platforms", filters.platforms),
            ...idMatcher("playerPerspectives", filters.playerPerspectives),
            ...idMatcher("publishers", filters.publishers),
          },
          fieldsMap[type],
        )
        .sort({ [sort.field]: sort.direction })
        .limit(limit || 0);

      this.logger.debug("Successfully retrieved filtered games", { count: results.length });
      return results as unknown as T extends "list"
        ? GameListModel[]
        : T extends "featured"
          ? FeaturedGameModel[]
          : GameStoreModel[];
    } catch (error) {
      this.logger.error("Database error while finding filtered games", error, { filters, type });
      throw error;
    }
  }

  async findGameById(id: string) {
    try {
      return await db.findOne<GameStoreModel>({ _id: id });
    } catch (error) {
      this.logger.error("Database error while finding game", error, { id });
      throw error;
    }
  }

  async findGamesByGameIds(gameIds: string[], library: Library) {
    try {
      return await db.find<GameStoreModel>({ gameId: { $in: gameIds }, library });
    } catch (error) {
      this.logger.error("Database error while finding games by ids", error, { gameIds, library });
      throw error;
    }
  }

  async findUnsyncedGames() {
    return await db
      .find<GameStoreModel>({
        metadataSyncedAt: { $exists: false },
      })
      .sort({ name: 1 });
  }

  async findGamesByEpicNamespace(ids: string[]) {
    return await db.find<GameStoreModel>({
      library: "epic-game-store",
      "libraryMeta.namespace": { $in: ids },
    });
  }

  async findGamesByEpicAppName(ids: string[], library: Library) {
    return await db.find({ gameId: { $in: ids }, library }, { _id: 0, gameId: 1 });
  }

  async updateGameByEpicAppName(appName: string, updates: Partial<Omit<GameStoreModel, "createdAt">>) {
    return await db.update<GameStoreModel>(
      { "libraryMeta.appName": appName },
      { $set: updates },
      { returnUpdatedDocs: true },
    );
  }

  async updateGameById(id: string, updates: Partial<Omit<GameStoreModel, "createdAt">>) {
    try {
      return await db.update<GameStoreModel>({ _id: id }, { $set: updates }, { returnUpdatedDocs: true });
    } catch (error) {
      this.logger.error("Database error while updating game", error, { id });
      throw error;
    }
  }

  async updateGameByGameId(
    gameId: string,
    updates: Partial<Omit<GameStoreModel, "createdAt">>,
    { upsert = false }: { upsert?: boolean } = {},
  ) {
    try {
      return await db.update<GameStoreModel>({ gameId }, { $set: updates }, { returnUpdatedDocs: true, upsert });
    } catch (error) {
      this.logger.error("Database error while updating game by game id", error, { gameId });
      throw error;
    }
  }

  async removeGameById(id: string) {
    try {
      return await db.deleteOne({ _id: id }, { multi: false });
    } catch (error) {
      this.logger.error("Database error while removing game", error, { id });
      throw error;
    }
  }

  async toggleQuickLaunchGame(id: string) {
    try {
      const game = await this.findGameById(id);
      if (!game) {
        this.logger.warn("Game not found for quick launch toggle", { id });
        return;
      }
      return await this.updateGameById(id, { isQuickLaunch: !game?.isQuickLaunch });
    } catch (error) {
      this.logger.error("Database error while toggling quick launch", error, { id });
      throw error;
    }
  }

  async toggleFavouriteGame(id: string) {
    try {
      const game = await this.findGameById(id);
      if (!game) {
        this.logger.warn("Game not found for favourite toggle", { id });
        return;
      }
      return await this.updateGameById(id, { isFavourite: !game?.isFavourite });
    } catch (error) {
      this.logger.error("Database error while toggling favourite", error, { id });
      throw error;
    }
  }

  async findGameByGameId(gameId: string, library: Library) {
    try {
      return await db.findOne<GameStoreModel>({ gameId, library });
    } catch (error) {
      this.logger.error("Database error while finding game by game id", error, { gameId, library });
      throw error;
    }
  }

  async findRecentGames(limit: number) {
    try {
      return await db.find<GameStoreModel>({}).sort({ createdAt: -1 }).limit(limit);
    } catch (error) {
      this.logger.error("Database error while finding recent games", error, { limit });
      throw error;
    }
  }
}
