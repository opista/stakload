import type { CompanyWebsiteEntity } from "@stakload/database";

import type { CompanyWebsiteWebhookPayload } from "../types/igdb-webhook.types";
import { readBoolean, readDate, readId, readOptionalId, readString } from "./shared/mapper-utils";

export const mapCompanyWebsitePayload = (payload: CompanyWebsiteWebhookPayload): Partial<CompanyWebsiteEntity> => ({
  checksum: readString(payload.checksum),
  igdbId: readId(payload.id) ?? 0,
  sourceUpdatedAt: readDate(payload.updated_at),
  trusted: readBoolean(payload.trusted),
  typeId: readOptionalId(payload.type),
  url: readString(payload.url) ?? "",
});
