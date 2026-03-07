import type { GameEntity } from "@stakload/database";

import type { GameWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readIds, readNumber, readId, readOptionalId, readString } from "./shared/mapper-utils";

export const mapGamePayload = (payload: GameWebhookPayload): Partial<GameEntity> => ({
  ageRatings: readIds(payload.age_ratings),
  aggregatedRating: readNumber(payload.aggregated_rating),
  aggregatedRatingCount: readNumber(payload.aggregated_rating_count),
  alternativeNames: readIds(payload.alternative_names),
  artworks: readIds(payload.artworks),
  bundles: readIds(payload.bundles),
  checksum: readString(payload.checksum),
  cover: readOptionalId(payload.cover),
  externalGames: readIds(payload.external_games),
  firstReleaseDate: readDate(payload.first_release_date),
  franchise: readOptionalId(payload.franchise),
  gameEngines: readIds(payload.game_engines),
  gameStatus: readOptionalId(payload.game_status),
  gameType: readOptionalId(payload.game_type),
  igdbId: readId(payload.id) ?? 0,
  languageSupports: readIds(payload.language_supports),
  multiplayerModes: readIds(payload.multiplayer_modes),
  name: readString(payload.name),
  parentGame: readOptionalId(payload.parent_game),
  rating: readNumber(payload.rating),
  ratingCount: readNumber(payload.rating_count),
  similarGames: readIds(payload.similar_games),
  slug: readString(payload.slug),
  sourceUpdatedAt: readDate(payload.updated_at),
  storyline: readString(payload.storyline),
  summary: readString(payload.summary),
  totalRating: readNumber(payload.total_rating),
  totalRatingCount: readNumber(payload.total_rating_count),
  url: readString(payload.url),
  versionParent: readOptionalId(payload.version_parent),
  versionTitle: readString(payload.version_title),
  videos: readIds(payload.videos),
});
