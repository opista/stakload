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
    'slug', g."slug",
    'url', g."url",
    'summary', g."summary",
    'storyline', g."storyline",
    'rating', g."rating",
    'ratingCount', g."ratingCount",
    'aggregatedRating', g."aggregatedRating",
    'aggregatedRatingCount', g."aggregatedRatingCount",
    'totalRating', g."totalRating",
    'totalRatingCount', g."totalRatingCount",
    'firstReleaseDate', CASE
      WHEN g."firstReleaseDate" IS NULL THEN NULL
      ELSE FLOOR(EXTRACT(EPOCH FROM g."firstReleaseDate"))::bigint
    END,
    'gameStatus', (
      SELECT JSON_BUILD_OBJECT('id', gs."igdbId", 'name', gs."name")
      FROM game_statuses gs
      WHERE gs."igdbId" = g."gameStatus"
    ),
    'gameType', (
      SELECT JSON_BUILD_OBJECT('id', gt."igdbId", 'name', gt."name")
      FROM game_types gt
      WHERE gt."igdbId" = g."gameType"
    ),
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
    'platforms', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT('id', p."igdbId", 'name', p."name")
        ORDER BY p."igdbId"
      )
      FROM UNNEST(g."platforms") AS platform_id
      JOIN platforms p ON p."igdbId" = platform_id
    ), '[]'::json),
    'themes', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT('id', t."igdbId", 'name', t."name")
        ORDER BY t."igdbId"
      )
      FROM UNNEST(g."themes") AS theme_id
      JOIN themes t ON t."igdbId" = theme_id
    ), '[]'::json),
    'gameModes', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT('id', gm."igdbId", 'name', gm."name")
        ORDER BY gm."igdbId"
      )
      FROM UNNEST(g."gameModes") AS mode_id
      JOIN game_modes gm ON gm."igdbId" = mode_id
    ), '[]'::json),
    'playerPerspectives', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT('id', pp."igdbId", 'name', pp."name")
        ORDER BY pp."igdbId"
      )
      FROM UNNEST(g."playerPerspectives") AS pp_id
      JOIN player_perspectives pp ON pp."igdbId" = pp_id
    ), '[]'::json),
    'keywords', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT('id', k."igdbId", 'name', k."name")
        ORDER BY k."igdbId"
      )
      FROM UNNEST(g."keywords") AS keyword_id
      JOIN keywords k ON k."igdbId" = keyword_id
    ), '[]'::json),
    'cover', (
      SELECT JSON_BUILD_OBJECT(
        'animated', c."animated",
        'height', c."height",
        'imageId', c."imageId",
        'width', c."width"
      )
      FROM covers c
      WHERE c."igdbId" = g."cover"
    ),
    'artworks', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'animated', a."animated",
          'height', a."height",
          'imageId', a."imageId",
          'width', a."width"
        )
        ORDER BY a."igdbId"
      )
      FROM artworks a
      WHERE a."game" = g."igdbId"
    ), '[]'::json),
    'screenshots', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'animated', s."animated",
          'height', s."height",
          'imageId', s."imageId",
          'width', s."width"
        )
        ORDER BY s."igdbId"
      )
      FROM screenshots s
      WHERE s."game" = g."igdbId"
    ), '[]'::json),
    'videos', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', v."igdbId",
          'name', v."name",
          'videoId', v."videoId"
        )
        ORDER BY v."igdbId"
      )
      FROM game_videos v
      WHERE v."game" = g."igdbId"
    ), '[]'::json),
    'involvedCompanies', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', ic."igdbId",
          'company', JSON_BUILD_OBJECT(
            'id', co."igdbId",
            'name', co."name"
          ),
          'developer', COALESCE(ic."developer", false),
          'publisher', COALESCE(ic."publisher", false),
          'porting', COALESCE(ic."porting", false),
          'supporting', COALESCE(ic."supporting", false)
        )
        ORDER BY ic."igdbId"
      )
      FROM involved_companies ic
      JOIN companies co ON co."igdbId" = ic."company"
      WHERE ic."game" = g."igdbId"
    ), '[]'::json)
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
