import type { GameEntity } from "@stakload/database";

import type { GameWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readNumber, readId, readOptionalId, readString } from "./shared/mapper-utils";

export const mapGamePayload = (payload: GameWebhookPayload): Partial<GameEntity> => ({
  aggregatedRating: readNumber(payload.aggregated_rating),
  aggregatedRatingCount: readNumber(payload.aggregated_rating_count),
  checksum: readString(payload.checksum),
  coverId: readOptionalId(payload.cover),
  firstReleaseDate: readDate(payload.first_release_date),
  gameStatusId: readOptionalId(payload.game_status),
  gameTypeId: readOptionalId(payload.game_type),
  igdbId: readId(payload.id) ?? 0,
  name: readString(payload.name),
  parentGameId: readOptionalId(payload.parent_game),
  rating: readNumber(payload.rating),
  ratingCount: readNumber(payload.rating_count),
  slug: readString(payload.slug),
  sourceUpdatedAt: readDate(payload.updated_at),
  storyline: readString(payload.storyline),
  summary: readString(payload.summary),
  totalRating: readNumber(payload.total_rating),
  totalRatingCount: readNumber(payload.total_rating_count),
  url: readString(payload.url),
  versionParentId: readOptionalId(payload.version_parent),
  versionTitle: readString(payload.version_title),
});
