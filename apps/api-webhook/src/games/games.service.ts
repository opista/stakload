import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import {
  buildGameCacheKey,
  cacheGameAndDependencies,
  GAME_AGGREGATE_QUERY_BY_IDS,
  GAME_METADATA_SOURCE_IDS,
  mapAggregatedGameToDto,
  mapGameBuildRows,
  mapGameDtoToGameMetadata,
  type GameBuildQueryRow,
  type GameCacheRedisClient,
  type GameDto,
  type GameMetadata,
  type GameMetadataSource,
} from "@stakload/game-cache-contracts";
import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

type ExternalGameLookupRow = {
  externalGameId: string;
  igdbId: number;
};

const EXTERNAL_GAME_LOOKUP_QUERY = `
  SELECT eg."uid" AS "externalGameId", eg."game" AS "igdbId"
  FROM external_games eg
  WHERE eg."externalGameSource" = $1
    AND eg."uid" = ANY($2::text[])
    AND eg."game" IS NOT NULL
  ORDER BY eg."uid", eg."igdbId"
`;

@Injectable()
export class GamesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: PinoLogger,
    private readonly redisService: RedisService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private async cacheGamesBestEffort(games: GameDto[]): Promise<void> {
    await Promise.all(
      games.map(async (game) => {
        try {
          await cacheGameAndDependencies(this.redisService.client as GameCacheRedisClient, game);
        } catch (error) {
          this.logger.warn({ err: error, gameId: game.id }, "Failed to write game metadata cache");
        }
      }),
    );
  }

  private async fetchCachedGamesById(igdbIds: number[]): Promise<Map<number, GameDto>> {
    const cachedGames = new Map<number, GameDto>();
    if (!igdbIds.length) return cachedGames;

    const cacheKeys = igdbIds.map(buildGameCacheKey);

    try {
      const cachedValues = await this.redisService.client.mget(...cacheKeys);
      if (!Array.isArray(cachedValues)) {
        this.logger.warn({ responseType: typeof cachedValues }, "Unexpected game metadata cache response");
        return cachedGames;
      }

      cachedValues.forEach((cachedValue, index) => {
        if (!cachedValue) return;

        try {
          const game = mapAggregatedGameToDto(cachedValue);
          cachedGames.set(game.id, game);
        } catch (error) {
          this.logger.warn({ err: error, gameId: igdbIds[index] }, "Failed to parse cached game metadata");
        }
      });
    } catch (error) {
      this.logger.warn({ err: error }, "Failed to read game metadata cache");
    }

    return cachedGames;
  }

  private async fetchExternalGameMappings(
    source: GameMetadataSource,
    externalGameIds: string[],
  ): Promise<Map<string, number>> {
    const rows = await this.dataSource.query<ExternalGameLookupRow[]>(EXTERNAL_GAME_LOOKUP_QUERY, [
      GAME_METADATA_SOURCE_IDS[source],
      externalGameIds,
    ]);
    const mappings = new Map<string, number>();

    for (const row of rows) {
      if (!mappings.has(row.externalGameId)) {
        mappings.set(row.externalGameId, row.igdbId);
      }
    }

    return mappings;
  }

  private async fetchPostgresGamesById(igdbIds: number[]): Promise<GameDto[]> {
    if (!igdbIds.length) return [];

    try {
      const rows = await this.dataSource.query<GameBuildQueryRow[]>(GAME_AGGREGATE_QUERY_BY_IDS, [igdbIds]);
      return mapGameBuildRows(rows);
    } catch (error) {
      this.logger.error({ err: error, gameIds: igdbIds }, "Failed to fetch game metadata from Postgres");
      throw error;
    }
  }

  async findByExternalIds(source: GameMetadataSource, externalGameIds: string[]): Promise<GameMetadata[]> {
    const uniqueExternalGameIds = Array.from(new Set(externalGameIds));
    const externalGameMappings = await this.fetchExternalGameMappings(source, uniqueExternalGameIds);
    const uniqueIgdbIds = Array.from(new Set(externalGameMappings.values()));

    if (!uniqueIgdbIds.length) return [];

    const gamesByIgdbId = await this.fetchCachedGamesById(uniqueIgdbIds);
    const missingIgdbIds = uniqueIgdbIds.filter((igdbId) => !gamesByIgdbId.has(igdbId));
    const postgresGames = await this.fetchPostgresGamesById(missingIgdbIds);

    for (const game of postgresGames) {
      gamesByIgdbId.set(game.id, game);
    }

    if (postgresGames.length) {
      await this.cacheGamesBestEffort(postgresGames);
    }

    return uniqueExternalGameIds.flatMap((externalGameId) => {
      const igdbId = externalGameMappings.get(externalGameId);
      if (!igdbId) return [];

      const game = gamesByIgdbId.get(igdbId);
      if (!game) return [];

      return [mapGameDtoToGameMetadata(game, source, externalGameId)];
    });
  }
}
