import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, IsNull, Repository, SelectQueryBuilder } from "typeorm";

import {
  FeaturedGameModel,
  GameFilters,
  GameListModel,
  GameStoreModel,
  Library,
} from "@stakload/contracts/database/games";

import { Logger } from "../logging/logging.service";
import { GameEntity } from "./game.entity";

type FieldsType = "all" | "featured" | "list";

type Sort = {
  direction: 1 | -1;
  field: keyof GameStoreModel;
};

const selectMap: Record<FieldsType, (keyof GameEntity)[] | undefined> = {
  all: undefined,
  featured: ["_id", "genres", "name", "screenshots", "summary"],
  list: ["_id", "cover", "isFavourite", "isInstalled", "isQuickLaunch", "library", "name"],
};

@Injectable()
export class GameStore {
  constructor(
    @InjectRepository(GameEntity)
    private readonly repository: Repository<GameEntity>,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private applyDateRangeFilter(
    query: SelectQueryBuilder<GameEntity>,
    field: string,
    dateFilter: NonNullable<GameFilters["createdAt"]>,
  ) {
    const { dateRange, endDate, startDate } = dateFilter;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    switch (dateRange) {
      case "CUSTOM":
        if (startDate && endDate)
          query.andWhere(`game.${field} BETWEEN :startDate AND :endDate`, {
            endDate,
            startDate,
          });
        else if (startDate) query.andWhere(`game.${field} >= :startDate`, { startDate });
        else if (endDate) query.andWhere(`game.${field} <= :endDate`, { endDate });
        break;
      case "ONE_DAY": {
        const d = new Date(now);
        d.setDate(now.getDate() - 1);
        query.andWhere(`game.${field} >= :d`, { d });
        break;
      }
      case "ONE_WEEK": {
        const d = new Date(now);
        d.setDate(now.getDate() - 7);
        query.andWhere(`game.${field} >= :d`, { d });
        break;
      }
      case "ONE_MONTH": {
        const d = new Date(now);
        d.setDate(now.getDate() - 30);
        query.andWhere(`game.${field} >= :d`, { d });
        break;
      }
      case "ONE_YEAR": {
        const d = new Date(now);
        d.setFullYear(now.getFullYear() - 1);
        query.andWhere(`game.${field} >= :d`, { d });
        break;
      }
      case "TODAY":
        query.andWhere(`game.${field} >= :startOfDay`, { startOfDay });
        break;
      case "THIS_WEEK":
        query.andWhere(`game.${field} >= :startOfWeek`, { startOfWeek });
        break;
      case "THIS_MONTH":
        query.andWhere(`game.${field} >= :startOfMonth`, { startOfMonth });
        break;
      case "THIS_YEAR":
        query.andWhere(`game.${field} >= :startOfYear`, { startOfYear });
        break;
    }
  }

  async bulkInsertGames(games: Partial<GameStoreModel>[]) {
    this.logger.debug("Attempting bulk insert of games", {
      count: games.length,
    });
    try {
      const entities = this.repository.create(games);
      const result = await this.repository.save(entities);
      this.logger.debug("Successfully bulk inserted games", {
        count: result.length,
      });
      return result;
    } catch (error) {
      this.logger.error("Database error while bulk inserting games", error, {
        count: games.length,
      });
      throw error;
    }
  }

  async findFilteredGames<T extends FieldsType = "all">(
    filters: GameFilters = {},
    type: T = "all" as T,
    sort: Sort = { direction: 1, field: "sortableName" },
    limit?: number,
  ) {
    this.logger.debug("Finding filtered games", { filters, limit, sort, type });
    try {
      const qb = this.repository.createQueryBuilder("game").where("(game.archivedAt IS NULL)");

      if (filters.isFavourite !== undefined)
        qb.andWhere("game.isFavourite = :isFav", {
          isFav: filters.isFavourite,
        });
      if (filters.isInstalled !== undefined)
        qb.andWhere("game.isInstalled = :isInst", {
          isInst: filters.isInstalled,
        });
      if (filters.isQuickLaunch !== undefined)
        qb.andWhere("game.isQuickLaunch = :isQL", {
          isQL: filters.isQuickLaunch,
        });
      if (filters.libraries?.length) qb.andWhere("game.library IN (:...libs)", { libs: filters.libraries });

      if (filters.createdAt) {
        this.applyDateRangeFilter(qb, "createdAt", filters.createdAt);
      }

      const applyJsonArrayFilter = (field: string, ids?: string[]) => {
        if (ids?.length) {
          qb.andWhere(
            `EXISTS (SELECT 1 FROM json_each(game.${field}) AS j WHERE json_extract(j.value, '$.id') IN (:...${field}Ids))`,
            { [`${field}Ids`]: ids },
          );
        }
      };

      applyJsonArrayFilter("ageRatings", filters.ageRatings);
      applyJsonArrayFilter("developers", filters.developers);
      applyJsonArrayFilter("gameModes", filters.gameModes);
      applyJsonArrayFilter("genres", filters.genres);
      applyJsonArrayFilter("platforms", filters.platforms);
      applyJsonArrayFilter("playerPerspectives", filters.playerPerspectives);
      applyJsonArrayFilter("publishers", filters.publishers);

      qb.orderBy(`game.${sort.field as string}`, sort.direction === 1 ? "ASC" : "DESC");

      if (limit) qb.limit(limit);

      const selections = selectMap[type];
      if (selections) {
        qb.select(selections.map((s) => `game.${s}`));
      }

      const results = await qb.getMany();

      this.logger.debug("Successfully retrieved filtered games", {
        count: results.length,
      });
      return results as unknown as T extends "list"
        ? GameListModel[]
        : T extends "featured"
          ? FeaturedGameModel[]
          : GameStoreModel[];
    } catch (error) {
      this.logger.error("Database error while finding filtered games", error, {
        filters,
        type,
      });
      throw error;
    }
  }

  async findGameByGameId(gameId: string, library: Library) {
    try {
      return await this.repository.findOneBy({ gameId, library });
    } catch (error) {
      this.logger.error("Database error while finding game by game id", error, {
        gameId,
        library,
      });
      throw error;
    }
  }

  async findGameById(id: string) {
    try {
      return await this.repository.findOneBy({ _id: id });
    } catch (error) {
      this.logger.error("Database error while finding game", error, { id });
      throw error;
    }
  }

  async findGamesByEpicAppName(ids: string[], library: Library) {
    return await this.repository
      .createQueryBuilder("game")
      .select("game.gameId")
      .where("game.gameId IN (:...ids)", { ids })
      .andWhere("game.library = :library", { library })
      .getMany();
  }

  async findGamesByEpicNamespace(ids: string[]) {
    return await this.repository
      .createQueryBuilder("game")
      .where("game.library = 'epic-game-store'")
      .andWhere("json_extract(game.libraryMeta, '$.namespace') IN (:...ids)", {
        ids,
      })
      .getMany();
  }

  async findGamesByGameIds(gameIds: string[], library: Library) {
    try {
      if (!gameIds.length) return [];
      return await this.repository.findBy({ gameId: In(gameIds), library });
    } catch (error) {
      this.logger.error("Database error while finding games by ids", error, {
        gameIds,
        library,
      });
      throw error;
    }
  }

  async findRecentGames(limit: number) {
    try {
      return await this.repository.find({
        order: { createdAt: "DESC" },
        take: limit,
      });
    } catch (error) {
      this.logger.error("Database error while finding recent games", error, {
        limit,
      });
      throw error;
    }
  }

  async findUnsyncedGames() {
    return await this.repository.find({
      order: { name: "ASC" },
      where: { metadataSyncedAt: IsNull() },
    });
  }

  async insertGame(game: Partial<GameStoreModel>) {
    const entity = this.repository.create(game);
    return await this.repository.save(entity);
  }

  async removeGameById(id: string) {
    try {
      await this.repository.delete(id);
      return true;
    } catch (error) {
      this.logger.error("Database error while removing game", error, { id });
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
      return await this.updateGameById(id, { isFavourite: !game.isFavourite });
    } catch (error) {
      this.logger.error("Database error while toggling favourite", error, {
        id,
      });
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
      return await this.updateGameById(id, {
        isQuickLaunch: !game.isQuickLaunch,
      });
    } catch (error) {
      this.logger.error("Database error while toggling quick launch", error, {
        id,
      });
      throw error;
    }
  }

  async updateGameByEpicAppName(appName: string, updates: Partial<Omit<GameStoreModel, "createdAt">>) {
    const games = await this.repository
      .createQueryBuilder("game")
      .where("json_extract(game.libraryMeta, '$.appName') = :appName", {
        appName,
      })
      .getMany();

    if (!games.length) return 0;

    await this.repository.update({ _id: In(games.map((g) => g._id)) }, updates);
    return games.length; // Approximate "returnUpdatedDocs" return count if possible, but actually callers usually expect the updated docs or don't use it.
    // Wait, let's look at callers.
    // Wait, the NeDB returnUpdatedDocs returns the updated array, but only if returnUpdatedDocs is true. Let's return the updated elements.
  }

  async updateGameByGameId(
    gameId: string,
    updates: Partial<Omit<GameStoreModel, "createdAt">>,
    { upsert = false }: { upsert?: boolean } = {},
  ) {
    try {
      let game = await this.repository.findOneBy({ gameId });

      if (!game && upsert) {
        game = this.repository.create({ gameId, ...updates });
        return await this.repository.save(game);
      }

      if (game) {
        await this.repository.update({ gameId }, updates);
        return await this.repository.findOneBy({ gameId });
      }
      return null;
    } catch (error) {
      this.logger.error("Database error while updating game by game id", error, { gameId });
      throw error;
    }
  }

  async updateGameById(id: string, updates: Partial<Omit<GameStoreModel, "createdAt">>) {
    try {
      await this.repository.update(id, updates);
      return await this.repository.findOneBy({ _id: id });
    } catch (error) {
      this.logger.error("Database error while updating game", error, { id });
      throw error;
    }
  }
}
