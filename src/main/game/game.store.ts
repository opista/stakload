import { FeaturedGameModel, GameFilters, GameListModel, GameStoreModel, Library } from "@contracts/database/games";
import { createDb } from "@util/database/create-db";
import { dateRangeMatcher } from "@util/database/date-range-matcher";
import { idMatcher } from "@util/database/id-matcher";
import { Service } from "typedi";

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
  async bulkInsertGames(games: Partial<GameStoreModel>[]) {
    return await db.insertMany<Partial<GameStoreModel>>(games);
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
    return (await db
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
      .limit(limit || 0)) as { _id: string; name: string }[] as T extends "list"
      ? GameListModel[]
      : T extends "featured"
        ? FeaturedGameModel[]
        : GameStoreModel[];
  }

  async findGameById(id: string) {
    return await db.findOne<GameStoreModel>({ _id: id });
  }

  async findGamesByGameIds(gameIds: string[], library: Library) {
    return await db.find<GameStoreModel>({ gameId: { $in: gameIds }, library });
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
    return await db.update<GameStoreModel>({ _id: id }, { $set: updates }, { returnUpdatedDocs: true });
  }

  async updateGameByGameId(gameId: string, updates: Partial<Omit<GameStoreModel, "createdAt">>) {
    return await db.update<GameStoreModel>({ gameId }, { $set: updates }, { returnUpdatedDocs: true });
  }

  async removeGameById(id: string) {
    return await db.deleteOne({ _id: id }, { multi: false });
  }

  async toggleQuickLaunchGame(id: string) {
    const game = await this.findGameById(id);
    // TODO proper handling here?
    if (!game) return;
    return await this.updateGameById(id, { isQuickLaunch: !game?.isQuickLaunch });
  }

  async toggleFavouriteGame(id: string) {
    const game = await this.findGameById(id);
    // TODO proper handling here?
    if (!game) return;
    return await this.updateGameById(id, { isFavourite: !game?.isFavourite });
  }
}
