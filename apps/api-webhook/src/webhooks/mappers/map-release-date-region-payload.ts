import type { ReleaseDateRegionEntity } from "@stakload/database";

import type { ReleaseDateRegionWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readId, readString } from "./shared/mapper-utils";

export const mapReleaseDateRegionPayload = (
  payload: ReleaseDateRegionWebhookPayload,
): Partial<ReleaseDateRegionEntity> => ({
  checksum: readString(payload.checksum),
  igdbId: readId(payload.id) ?? 0,
  region: readString(payload.region),
  sourceUpdatedAt: readDate(payload.updated_at),
});
