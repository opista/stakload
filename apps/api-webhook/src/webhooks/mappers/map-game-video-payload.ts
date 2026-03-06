import type { GameVideoEntity } from "@stakload/database";

import type { GameVideoWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readId, readOptionalId, readString } from "./shared/mapper-utils";

export const mapGameVideoPayload = (payload: GameVideoWebhookPayload): Partial<GameVideoEntity> => ({
  checksum: readString(payload.checksum),
  gameId: readOptionalId(payload.game),
  igdbId: readId(payload.id) ?? 0,
  name: readString(payload.name),
  sourceUpdatedAt: readDate(payload.updated_at),
  videoId: readString(payload.video_id),
});
