import type { MultiplayerModeEntity } from "@stakload/database";

import type { MultiplayerModeWebhookPayload } from "../types/igdb-webhook.types";
import { readBoolean, readDate, readId, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

export const mapMultiplayerModePayload = (payload: MultiplayerModeWebhookPayload): Partial<MultiplayerModeEntity> => ({
  campaignCoop: readBoolean(payload.campaigncoop),
  checksum: readString(payload.checksum),
  dropIn: readBoolean(payload.dropin),
  game: readOptionalId(payload.game),
  igdbId: readId(payload.id) ?? 0,
  lanCoop: readBoolean(payload.lancoop),
  offlineCoop: readBoolean(payload.offlinecoop),
  offlineCoopMax: readNumber(payload.offlinecoopmax),
  offlineMax: readNumber(payload.offlinemax),
  onlineCoop: readBoolean(payload.onlinecoop),
  onlineCoopMax: readNumber(payload.onlinecoopmax),
  onlineMax: readNumber(payload.onlinemax),
  platform: readOptionalId(payload.platform),
  sourceUpdatedAt: readDate(payload.updated_at),
  splitScreen: readBoolean(payload.splitscreen),
  splitScreenOnline: readBoolean(payload.splitscreenonline),
});
