import type { PlatformLogoEntity } from "@stakload/database";

import type { PlatformLogoWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseImageAsset } from "./shared/mapper-utils";

export const mapPlatformLogoPayload = (payload: PlatformLogoWebhookPayload): Partial<PlatformLogoEntity> =>
  mapBaseImageAsset(payload);
