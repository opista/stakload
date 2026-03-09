import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { PinoLogger } from "@stakload/nestjs-logging";

import type { GameDto } from "../../models/dto/game.dto";
import { mapAggregatedGameToDto, type RawAggregatedGameDto } from "../mappers/map-aggregated-game-to-dto";

interface GameBuildQueryRow {
  game: RawAggregatedGameDto | string | null;
}

const GAME_BUILD_QUERY = `
  SELECT JSON_BUILD_OBJECT(
    'id', g."igdbId",
    'name', g."name",
    'summary', g."summary",
    'rating', g."rating",
    'firstReleaseDate', CASE
      WHEN g."firstReleaseDate" IS NULL THEN NULL
      ELSE FLOOR(EXTRACT(EPOCH FROM g."firstReleaseDate"))::bigint
    END,
    'genres', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', genre."igdbId",
          'name', genre."name"
        )
        ORDER BY genre."igdbId"
      )
      FROM UNNEST(g."genres") AS genre_id
      JOIN genres genre ON genre."igdbId" = genre_id
    ), '[]'::json),
    'platforms', '[]'::json,
    'themes', '[]'::json,
    'cover', NULL
  ) AS game
  FROM games g
  WHERE g."igdbId" = $1
  LIMIT 1
`;

@Injectable()
export class GameAggregateQueryService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async fetchByGameId(gameId: number): Promise<GameDto | null> {
    const rows = await this.dataSource.query<GameBuildQueryRow[]>(GAME_BUILD_QUERY, [gameId]);
    const row = rows.at(0);

    if (!row || row.game === null) {
      return null;
    }

    try {
      return mapAggregatedGameToDto(row.game);
    } catch (error) {
      this.logger.error({ err: error, gameId }, "Failed to map aggregated game payload");
      throw error;
    }
  }
}
