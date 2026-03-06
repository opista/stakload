import type { GameTypeEntity } from "@stakload/database";

import type { GameTypeWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readId, readString } from "./shared/mapper-utils";

export const mapGameTypePayload = (payload: GameTypeWebhookPayload): Partial<GameTypeEntity> => ({
  checksum: readString(payload.checksum),
  igdbId: readId(payload.id) ?? 0,
  sourceUpdatedAt: readDate(payload.updated_at),
  type: readString(payload.type) ?? "",
});
