import type { GameEntity } from "@stakload/database";

import type { GameWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readIds, readNumber, readId, readOptionalId, readString } from "./shared/mapper-utils";

export const mapGamePayload = (payload: GameWebhookPayload): Partial<GameEntity> => ({
  ageRatingIds: readIds(payload.age_ratings),
  aggregatedRating: readNumber(payload.aggregated_rating),
  aggregatedRatingCount: readNumber(payload.aggregated_rating_count),
  alternativeNameIds: readIds(payload.alternative_names),
  artworkIds: readIds(payload.artworks),
  bundleIds: readIds(payload.bundles),
  checksum: readString(payload.checksum),
  coverId: readOptionalId(payload.cover),
  externalGameIds: readIds(payload.external_games),
  firstReleaseDate: readDate(payload.first_release_date),
  franchiseId: readOptionalId(payload.franchise),
  gameEngineIds: readIds(payload.game_engines),
  gameStatusId: readOptionalId(payload.game_status),
  gameTypeId: readOptionalId(payload.game_type),
  igdbId: readId(payload.id) ?? 0,
  languageSupportIds: readIds(payload.language_supports),
  multiplayerModeIds: readIds(payload.multiplayer_modes),
  name: readString(payload.name),
  parentGameId: readOptionalId(payload.parent_game),
  rating: readNumber(payload.rating),
  ratingCount: readNumber(payload.rating_count),
  similarGameIds: readIds(payload.similar_games),
  slug: readString(payload.slug),
  sourceUpdatedAt: readDate(payload.updated_at),
  storyline: readString(payload.storyline),
  summary: readString(payload.summary),
  totalRating: readNumber(payload.total_rating),
  totalRatingCount: readNumber(payload.total_rating_count),
  url: readString(payload.url),
  versionParentId: readOptionalId(payload.version_parent),
  versionTitle: readString(payload.version_title),
  videoIds: readIds(payload.videos),
});
