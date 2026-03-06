import type { DateFormatEntity } from "@stakload/database";

import type { DateFormatWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readId, readString } from "./shared/mapper-utils";

export const mapDateFormatPayload = (payload: DateFormatWebhookPayload): Partial<DateFormatEntity> => ({
  checksum: readString(payload.checksum),
  format: readString(payload.format) ?? "",
  igdbId: readId(payload.id) ?? 0,
  sourceUpdatedAt: readDate(payload.updated_at),
});
