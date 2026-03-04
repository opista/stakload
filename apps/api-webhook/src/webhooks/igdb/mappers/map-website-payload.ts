import type { WebsiteEntity } from "@stakload/database";

import type { WebsiteWebhookPayload } from "../types/igdb-webhook.types";
import { readBoolean, readDate, readId, readOptionalId, readString } from "./shared/mapper-utils";

export const mapWebsitePayload = (payload: WebsiteWebhookPayload): Partial<WebsiteEntity> => ({
  checksum: readString(payload.checksum),
  gameId: readOptionalId(payload.game),
  igdbId: readId(payload.id) ?? 0,
  sourceUpdatedAt: readDate(payload.updated_at),
  trusted: readBoolean(payload.trusted),
  typeId: readOptionalId(payload.type),
  url: readString(payload.url) ?? "",
});
