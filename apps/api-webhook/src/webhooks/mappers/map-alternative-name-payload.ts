import type { AlternativeNameEntity } from "@stakload/database";

import type { AlternativeNameWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readId, readOptionalId, readString } from "./shared/mapper-utils";

export const mapAlternativeNamePayload = (payload: AlternativeNameWebhookPayload): Partial<AlternativeNameEntity> => ({
  checksum: readString(payload.checksum),
  comment: readString(payload.comment),
  gameId: readOptionalId(payload.game),
  igdbId: readId(payload.id) ?? 0,
  name: readString(payload.name) ?? "",
  sourceUpdatedAt: readDate(payload.updated_at),
});
