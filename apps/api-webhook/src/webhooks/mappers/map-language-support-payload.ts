import type { LanguageSupportEntity } from "@stakload/database";

import type { LanguageSupportWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readId, readOptionalId, readString } from "./shared/mapper-utils";

export const mapLanguageSupportPayload = (payload: LanguageSupportWebhookPayload): Partial<LanguageSupportEntity> => ({
  checksum: readString(payload.checksum),
  gameId: readOptionalId(payload.game),
  igdbId: readId(payload.id) ?? 0,
  languageId: readOptionalId(payload.language),
  languageSupportTypeId: readOptionalId(payload.language_support_type),
  sourceUpdatedAt: readDate(payload.updated_at),
});
