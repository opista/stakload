import type { AgeRatingEntity } from "@stakload/database";

import type { AgeRatingWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readId, readIds, readOptionalId, readString } from "./shared/mapper-utils";

export const mapAgeRatingPayload = (payload: AgeRatingWebhookPayload): Partial<AgeRatingEntity> => ({
  checksum: readString(payload.checksum),
  igdbId: readId(payload.id) ?? 0,
  organizationId: readOptionalId(payload.organization),
  ratingCategoryId: readOptionalId(payload.rating_category),
  ratingContentDescriptionIds: readIds(payload.rating_content_descriptions),
  ratingCoverUrl: readString(payload.rating_cover_url),
  sourceUpdatedAt: readDate(payload.updated_at),
  synopsis: readString(payload.synopsis),
});
