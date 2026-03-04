import type { PlatformFamilyEntity } from "@stakload/database";

import type { PlatformFamilyWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged } from "./shared/mapper-utils";

export const mapPlatformFamilyPayload = (payload: PlatformFamilyWebhookPayload): Partial<PlatformFamilyEntity> =>
  mapBaseSlugged(payload);
