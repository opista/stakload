import type { ReleaseDateStatusEntity } from "@stakload/database";

import type { ReleaseDateStatusWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseNamed, readString } from "./shared/mapper-utils";

export const mapReleaseDateStatusPayload = (
  payload: ReleaseDateStatusWebhookPayload,
): Partial<ReleaseDateStatusEntity> => ({
  ...mapBaseNamed(payload),
  description: readString(payload.description),
});
