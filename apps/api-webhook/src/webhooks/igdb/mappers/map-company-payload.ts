import type { CompanyEntity } from "@stakload/database";

import type { CompanyWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged, readDate, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

export const mapCompanyPayload = (payload: CompanyWebhookPayload): Partial<CompanyEntity> => ({
  ...mapBaseSlugged(payload),
  changeDateFormatId: readOptionalId(payload.change_date_format),
  changedCompanyId: readOptionalId(payload.changed_company),
  companySizeId: readOptionalId(payload.company_size),
  country: readNumber(payload.country),
  description: readString(payload.description),
  logoId: readOptionalId(payload.logo),
  parentId: readOptionalId(payload.parent),
  startDate: readDate(payload.start_date),
  startDateFormatId: readOptionalId(payload.start_date_format),
  statusId: readOptionalId(payload.status),
});
