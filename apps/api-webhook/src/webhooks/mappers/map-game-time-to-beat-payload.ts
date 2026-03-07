import type { GameTimeToBeatEntity } from "@stakload/database";

import type { GameTimeToBeatWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readId, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

export const mapGameTimeToBeatPayload = (payload: GameTimeToBeatWebhookPayload): Partial<GameTimeToBeatEntity> => ({
  checksum: readString(payload.checksum),
  completely: readNumber(payload.completely),
  count: readNumber(payload.count),
  gameId: readOptionalId(payload.game_id),
  hastily: readNumber(payload.hastily),
  igdbId: readId(payload.id) ?? 0,
  normally: readNumber(payload.normally),
  sourceUpdatedAt: readDate(payload.updated_at),
});
