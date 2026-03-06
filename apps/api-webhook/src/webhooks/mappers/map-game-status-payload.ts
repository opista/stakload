import type { GameStatusEntity } from "@stakload/database";

import type { GameStatusWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readId, readString } from "./shared/mapper-utils";

export const mapGameStatusPayload = (payload: GameStatusWebhookPayload): Partial<GameStatusEntity> => ({
  checksum: readString(payload.checksum),
  igdbId: readId(payload.id) ?? 0,
  sourceUpdatedAt: readDate(payload.updated_at),
  status: readString(payload.status) ?? "",
});
