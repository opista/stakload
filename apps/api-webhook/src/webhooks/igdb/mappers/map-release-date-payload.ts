import type { ReleaseDateEntity } from "@stakload/database";

import type { ReleaseDateWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readDateOnly, readId, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

export const mapReleaseDatePayload = (payload: ReleaseDateWebhookPayload): Partial<ReleaseDateEntity> => ({
  checksum: readString(payload.checksum),
  date: readDateOnly(payload.date),
  dateFormatId: readOptionalId(payload.date_format),
  day: readNumber(payload.day),
  gameId: readOptionalId(payload.game),
  human: readString(payload.human),
  igdbId: readId(payload.id) ?? 0,
  month: readNumber(payload.month),
  platformId: readOptionalId(payload.platform),
  releaseRegionId: readOptionalId(payload.release_region),
  sourceUpdatedAt: readDate(payload.updated_at),
  statusId: readOptionalId(payload.status),
  year: readNumber(payload.year),
});
