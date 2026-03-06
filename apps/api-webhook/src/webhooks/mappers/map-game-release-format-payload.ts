import type { GameReleaseFormatEntity } from "@stakload/database";

import type { GameReleaseFormatWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readId, readString } from "./shared/mapper-utils";

export const mapGameReleaseFormatPayload = (
  payload: GameReleaseFormatWebhookPayload,
): Partial<GameReleaseFormatEntity> => ({
  checksum: readString(payload.checksum),
  format: readString(payload.format) ?? "",
  igdbId: readId(payload.id) ?? 0,
  sourceUpdatedAt: readDate(payload.updated_at),
});
