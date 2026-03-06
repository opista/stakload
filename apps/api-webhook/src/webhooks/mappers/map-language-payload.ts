import type { LanguageEntity } from "@stakload/database";

import type { LanguageWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readId, readString } from "./shared/mapper-utils";

export const mapLanguagePayload = (payload: LanguageWebhookPayload): Partial<LanguageEntity> => ({
  checksum: readString(payload.checksum),
  igdbId: readId(payload.id) ?? 0,
  locale: readString(payload.locale),
  name: readString(payload.name) ?? "",
  nativeName: readString(payload.native_name),
  sourceUpdatedAt: readDate(payload.updated_at),
});
