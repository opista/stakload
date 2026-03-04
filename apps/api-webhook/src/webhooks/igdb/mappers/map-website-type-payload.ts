import type { WebsiteTypeEntity } from "@stakload/database";

import type { WebsiteTypeWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readId, readString } from "./shared/mapper-utils";

export const mapWebsiteTypePayload = (payload: WebsiteTypeWebhookPayload): Partial<WebsiteTypeEntity> => ({
  checksum: readString(payload.checksum),
  igdbId: readId(payload.id) ?? 0,
  sourceUpdatedAt: readDate(payload.updated_at),
  type: readString(payload.type) ?? "",
});
