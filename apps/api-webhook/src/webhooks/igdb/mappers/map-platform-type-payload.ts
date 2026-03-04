import type { PlatformTypeEntity } from "@stakload/database";

import type { PlatformTypeWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseNamed } from "./shared/mapper-utils";

export const mapPlatformTypePayload = (payload: PlatformTypeWebhookPayload): Partial<PlatformTypeEntity> =>
  mapBaseNamed(payload);
