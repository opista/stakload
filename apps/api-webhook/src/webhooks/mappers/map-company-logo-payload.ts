import type { CompanyLogoEntity } from "@stakload/database";

import type { CompanyLogoWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseImageAsset } from "./shared/mapper-utils";

export const mapCompanyLogoPayload = (payload: CompanyLogoWebhookPayload): Partial<CompanyLogoEntity> =>
  mapBaseImageAsset(payload);
