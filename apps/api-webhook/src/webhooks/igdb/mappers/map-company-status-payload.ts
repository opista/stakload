import type { CompanyStatusEntity } from "@stakload/database";

import type { CompanyStatusWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseNamed } from "./shared/mapper-utils";

export const mapCompanyStatusPayload = (payload: CompanyStatusWebhookPayload): Partial<CompanyStatusEntity> =>
  mapBaseNamed(payload);
