import type { InvolvedCompanyEntity } from "@stakload/database";

import type { InvolvedCompanyWebhookPayload } from "../types/igdb-webhook.types";
import { readBoolean, readDate, readId, readString } from "./shared/mapper-utils";

export const mapInvolvedCompanyPayload = (payload: InvolvedCompanyWebhookPayload): Partial<InvolvedCompanyEntity> => ({
  checksum: readString(payload.checksum),
  company: readId(payload.company) ?? 0,
  developer: readBoolean(payload.developer),
  game: readId(payload.game) ?? 0,
  igdbId: readId(payload.id) ?? 0,
  porting: readBoolean(payload.porting),
  publisher: readBoolean(payload.publisher),
  sourceUpdatedAt: readDate(payload.updated_at),
  supporting: readBoolean(payload.supporting),
});
