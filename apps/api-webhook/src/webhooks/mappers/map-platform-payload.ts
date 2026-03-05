import type { PlatformEntity } from "@stakload/database";

import type { PlatformWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

export const mapPlatformPayload = (payload: PlatformWebhookPayload): Partial<PlatformEntity> => ({
  ...mapBaseSlugged(payload),
  abbreviation: readString(payload.abbreviation),
  alternativeName: readString(payload.alternative_name),
  generation: readNumber(payload.generation),
  platformFamilyId: readOptionalId(payload.platform_family),
  platformLogoId: readOptionalId(payload.platform_logo),
  platformTypeId: readOptionalId(payload.platform_type),
  summary: readString(payload.summary),
});
