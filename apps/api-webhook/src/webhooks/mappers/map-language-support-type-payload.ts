import type { LanguageSupportTypeEntity } from "@stakload/database";

import type { LanguageSupportTypeWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseNamed } from "./shared/mapper-utils";

export const mapLanguageSupportTypePayload = (
  payload: LanguageSupportTypeWebhookPayload,
): Partial<LanguageSupportTypeEntity> => mapBaseNamed(payload);
