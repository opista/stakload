import { FeaturedGameModel, GameFilters, GameStoreModel, Library } from "@contracts/database/games";
import { createDb } from "@util/database/create-db";
import { dateRangeMatcher } from "@util/database/date-range-matcher";
import { idMatcher } from "@util/database/id-matcher";
import { Service } from "typedi";

type FieldsType = "all" | "featured" | "list";

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

  async findFilteredGames<T>(
    {
      ageRatings,
      createdAt,
      developers,
      gameModes,
      genres,
      isFavourite,
      isInstalled,
      isQuickLaunch,
      libraries,
      platforms,
      playerPerspectives,
      publishers,
    }: GameFilters = {},
    type: FieldsType = "all",
  ) {
    return await db
      .find<T>(
        {
          $or: [{ archivedAt: null }, { archivedAt: { $exists: false } }],
          ...(ageRatings?.length && { ageRating: { $in: ageRatings } }),
          ...(isFavourite != undefined && { isFavourite }),
          ...(isInstalled != undefined && { isInstalled }),
          ...(isQuickLaunch != undefined && { isQuickLaunch }),
          ...(libraries?.length && { library: { $in: libraries } }),
          ...dateRangeMatcher("createdAt", createdAt),
          ...idMatcher("developers", developers),
          ...idMatcher("gameModes", gameModes),
          ...idMatcher("genres", genres),
          ...idMatcher("platforms", platforms),
          ...idMatcher("playerPerspectives", playerPerspectives),
          ...idMatcher("publishers", publishers),
        },
        fieldsMap[type],
      )
      // TODO - custom sorting?
      .sort({ sortableName: 1 });
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

  // TODO - kill this in favour of using filter games query
  async getNewGames() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return await db
      .find<FeaturedGameModel>(
        {
          $or: [{ archivedAt: null }, { archivedAt: { $exists: false } }],
          createdAt: { $gte: oneWeekAgo },
        },
        fieldsMap.featured,
      )
      .sort({ createdAt: -1 })
      .limit(10);
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
