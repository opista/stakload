import type { CompanyEntity } from "@stakload/database";

import type { CompanyWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged, readDate, readIds, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

export const mapCompanyPayload = (payload: CompanyWebhookPayload): Partial<CompanyEntity> => ({
  ...mapBaseSlugged(payload),
  changeDateFormat: readOptionalId(payload.change_date_format),
  changedCompany: readOptionalId(payload.changed_company),
  country: readNumber(payload.country),
  description: readString(payload.description),
  developed: readIds(payload.developed),
  logo: readOptionalId(payload.logo),
  parent: readOptionalId(payload.parent),
  published: readIds(payload.published),
  startDate: readDate(payload.start_date),
  startDateFormat: readOptionalId(payload.start_date_format),
  status: readOptionalId(payload.status),
});
