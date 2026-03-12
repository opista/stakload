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
    'checksum', g."checksum",
    'sourceUpdatedAt', g."sourceUpdatedAt",
    'createdAt', g."createdAt",
    'updatedAt', g."updatedAt",
    'versionTitle', g."versionTitle",
    'alternativeNames', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', an."igdbId",
          'checksum', an."checksum",
          'comment', an."comment",
          'game', an."game",
          'name', an."name",
          'sourceUpdatedAt', an."sourceUpdatedAt",
          'createdAt', an."createdAt",
          'updatedAt', an."updatedAt"
        )
        ORDER BY an."igdbId"
      )
      FROM UNNEST(g."alternativeNames") AS alternative_name_id
      JOIN alternative_names an ON an."igdbId" = alternative_name_id
    ), '[]'::json),
    'bundles', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', bundle_game."igdbId",
          'name', bundle_game."name",
          'slug', bundle_game."slug",
          'url', bundle_game."url"
        )
        ORDER BY bundle_game."igdbId"
      )
      FROM UNNEST(g."bundles") AS bundle_id
      JOIN games bundle_game ON bundle_game."igdbId" = bundle_id
    ), '[]'::json),
    'collections', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', collection."igdbId",
          'name', collection."name",
          'slug', collection."slug",
          'url', collection."url",
          'checksum', collection."checksum",
          'description', collection."description",
          'games', collection."games",
          'sourceUpdatedAt', collection."sourceUpdatedAt",
          'createdAt', collection."createdAt",
          'updatedAt', collection."updatedAt"
        )
        ORDER BY collection."igdbId"
      )
      FROM UNNEST(g."collections") AS collection_id
      JOIN collections collection ON collection."igdbId" = collection_id
    ), '[]'::json),
    'externalGames', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', eg."igdbId",
          'checksum', eg."checksum",
          'countries', eg."countries",
          'externalGameSource', eg."externalGameSource",
          'externalGameSourceDetails', CASE
            WHEN egs."igdbId" IS NULL THEN NULL
            ELSE JSON_BUILD_OBJECT(
              'id', egs."igdbId",
              'name', egs."name",
              'checksum', egs."checksum",
              'sourceUpdatedAt', egs."sourceUpdatedAt",
              'createdAt', egs."createdAt",
              'updatedAt', egs."updatedAt"
            )
          END,
          'game', eg."game",
          'gameReleaseFormat', eg."gameReleaseFormat",
          'gameReleaseFormatDetails', CASE
            WHEN grf."igdbId" IS NULL THEN NULL
            ELSE JSON_BUILD_OBJECT(
              'id', grf."igdbId",
              'name', grf."name",
              'checksum', grf."checksum",
              'sourceUpdatedAt', grf."sourceUpdatedAt",
              'createdAt', grf."createdAt",
              'updatedAt', grf."updatedAt"
            )
          END,
          'name', eg."name",
          'platform', eg."platform",
          'platformDetails', CASE
            WHEN external_platform."igdbId" IS NULL THEN NULL
            ELSE JSON_BUILD_OBJECT(
              'id', external_platform."igdbId",
              'name', external_platform."name",
              'checksum', external_platform."checksum",
              'slug', external_platform."slug",
              'url', external_platform."url",
              'sourceUpdatedAt', external_platform."sourceUpdatedAt",
              'createdAt', external_platform."createdAt",
              'updatedAt', external_platform."updatedAt"
            )
          END,
          'uid', eg."uid",
          'url', eg."url",
          'year', eg."year",
          'sourceUpdatedAt', eg."sourceUpdatedAt",
          'createdAt', eg."createdAt",
          'updatedAt', eg."updatedAt"
        )
        ORDER BY eg."igdbId"
      )
      FROM UNNEST(g."externalGames") AS external_game_id
      JOIN external_games eg ON eg."igdbId" = external_game_id
      LEFT JOIN external_game_sources egs ON egs."igdbId" = eg."externalGameSource"
      LEFT JOIN game_release_formats grf ON grf."igdbId" = eg."gameReleaseFormat"
      LEFT JOIN platforms external_platform ON external_platform."igdbId" = eg."platform"
    ), '[]'::json),
    'franchise', (
      SELECT JSON_BUILD_OBJECT(
        'id', f."igdbId",
        'name', f."name",
        'slug', f."slug",
        'url', f."url",
        'checksum', f."checksum",
        'games', f."games",
        'sourceUpdatedAt', f."sourceUpdatedAt",
        'createdAt', f."createdAt",
        'updatedAt', f."updatedAt"
      )
      FROM franchises f
      WHERE f."igdbId" = g."franchise"
    ),
    'franchises', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', f."igdbId",
          'name', f."name",
          'slug', f."slug",
          'url', f."url",
          'checksum', f."checksum",
          'games', f."games",
          'sourceUpdatedAt', f."sourceUpdatedAt",
          'createdAt', f."createdAt",
          'updatedAt', f."updatedAt"
        )
        ORDER BY f."igdbId"
      )
      FROM UNNEST(g."franchises") AS franchise_id
      JOIN franchises f ON f."igdbId" = franchise_id
    ), '[]'::json),
    'gameEngines', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', ge."igdbId",
          'name', ge."name",
          'slug', ge."slug",
          'url', ge."url",
          'checksum', ge."checksum",
          'companies', ge."companies",
          'description', ge."description",
          'logo', ge."logo",
          'platforms', ge."platforms",
          'sourceUpdatedAt', ge."sourceUpdatedAt",
          'createdAt', ge."createdAt",
          'updatedAt', ge."updatedAt"
        )
        ORDER BY ge."igdbId"
      )
      FROM UNNEST(g."gameEngines") AS game_engine_id
      JOIN game_engines ge ON ge."igdbId" = game_engine_id
    ), '[]'::json),
    'ageRatings', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', ar."igdbId",
          'name', arc."rating",
          'organisation', aro."name",
          'descriptions', COALESCE(age_rating_descriptions."descriptions", '[]'::json)
        )
        ORDER BY ar."igdbId"
      )
      FROM UNNEST(g."ageRatings") AS age_rating_id
      JOIN age_ratings ar ON ar."igdbId" = age_rating_id
      LEFT JOIN age_rating_categories arc ON arc."igdbId" = ar."ratingCategory"
      LEFT JOIN age_rating_organizations aro ON aro."igdbId" = ar."organization"
      LEFT JOIN LATERAL (
        SELECT JSON_AGG(age_description."description" ORDER BY age_description."igdbId")
          FILTER (WHERE age_description."description" IS NOT NULL) AS "descriptions"
        FROM UNNEST(ar."ratingContentDescriptions") AS description_id
        JOIN age_rating_content_descriptions_v2 age_description ON age_description."igdbId" = description_id
      ) AS age_rating_descriptions ON true
    ), '[]'::json),
    'firstReleaseDate', CASE
      WHEN g."firstReleaseDate" IS NULL THEN NULL
      ELSE FLOOR(EXTRACT(EPOCH FROM g."firstReleaseDate"))::bigint
    END,
    'languageSupports', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', ls."igdbId",
          'checksum', ls."checksum",
          'game', ls."game",
          'language', ls."language",
          'languageDetails', CASE
            WHEN language."igdbId" IS NULL THEN NULL
            ELSE JSON_BUILD_OBJECT(
              'id', language."igdbId",
              'name', language."name",
              'checksum', language."checksum",
              'sourceUpdatedAt', language."sourceUpdatedAt",
              'createdAt', language."createdAt",
              'updatedAt', language."updatedAt"
            )
          END,
          'languageSupportType', ls."languageSupportType",
          'languageSupportTypeDetails', CASE
            WHEN language_support_type."igdbId" IS NULL THEN NULL
            ELSE JSON_BUILD_OBJECT(
              'id', language_support_type."igdbId",
              'name', language_support_type."name",
              'checksum', language_support_type."checksum",
              'sourceUpdatedAt', language_support_type."sourceUpdatedAt",
              'createdAt', language_support_type."createdAt",
              'updatedAt', language_support_type."updatedAt"
            )
          END,
          'sourceUpdatedAt', ls."sourceUpdatedAt",
          'createdAt', ls."createdAt",
          'updatedAt', ls."updatedAt"
        )
        ORDER BY ls."igdbId"
      )
      FROM UNNEST(g."languageSupports") AS language_support_id
      JOIN language_supports ls ON ls."igdbId" = language_support_id
      LEFT JOIN languages language ON language."igdbId" = ls."language"
      LEFT JOIN language_support_types language_support_type ON language_support_type."igdbId" = ls."languageSupportType"
    ), '[]'::json),
    'multiplayerModes', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', mm."igdbId",
          'campaignCoop', mm."campaignCoop",
          'checksum', mm."checksum",
          'dropIn', mm."dropIn",
          'game', mm."game",
          'lanCoop', mm."lanCoop",
          'offlineCoop', mm."offlineCoop",
          'offlineCoopMax', mm."offlineCoopMax",
          'offlineMax', mm."offlineMax",
          'onlineCoop', mm."onlineCoop",
          'onlineCoopMax', mm."onlineCoopMax",
          'onlineMax', mm."onlineMax",
          'platform', mm."platform",
          'splitScreen', mm."splitScreen",
          'splitScreenOnline', mm."splitScreenOnline",
          'sourceUpdatedAt', mm."sourceUpdatedAt",
          'createdAt', mm."createdAt",
          'updatedAt', mm."updatedAt"
        )
        ORDER BY mm."igdbId"
      )
      FROM UNNEST(g."multiplayerModes") AS multiplayer_mode_id
      JOIN multiplayer_modes mm ON mm."igdbId" = multiplayer_mode_id
    ), '[]'::json),
    'parentGame', (
      SELECT JSON_BUILD_OBJECT(
        'id', parent_game."igdbId",
        'name', parent_game."name",
        'slug', parent_game."slug",
        'url', parent_game."url"
      )
      FROM games parent_game
      WHERE parent_game."igdbId" = g."parentGame"
    ),
    'gameStatus', (
      SELECT JSON_BUILD_OBJECT('id', gs."igdbId", 'name', gs."status")
      FROM game_statuses gs
      WHERE gs."igdbId" = g."gameStatus"
    ),
    'gameType', (
      SELECT JSON_BUILD_OBJECT('id', gt."igdbId", 'name', gt."type")
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
    'similarGames', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', similar_game."igdbId",
          'name', similar_game."name",
          'slug', similar_game."slug",
          'url', similar_game."url"
        )
        ORDER BY similar_game."igdbId"
      )
      FROM UNNEST(g."similarGames") AS similar_game_id
      JOIN games similar_game ON similar_game."igdbId" = similar_game_id
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
    'websites', COALESCE((
      SELECT JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', w."igdbId",
          'url', w."url",
          'trusted', w."trusted",
          'websiteType', CASE
            WHEN wt."igdbId" IS NULL THEN NULL
            ELSE JSON_BUILD_OBJECT(
              'id', wt."igdbId",
              'name', wt."type"
            )
          END
        )
        ORDER BY w."igdbId"
      )
      FROM websites w
      LEFT JOIN website_types wt ON wt."igdbId" = w."type"
      WHERE w."game" = g."igdbId"
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
    ), '[]'::json),
    'versionParent', (
      SELECT JSON_BUILD_OBJECT(
        'id', version_parent."igdbId",
        'name', version_parent."name",
        'slug', version_parent."slug",
        'url', version_parent."url"
      )
      FROM games version_parent
      WHERE version_parent."igdbId" = g."versionParent"
    )
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
