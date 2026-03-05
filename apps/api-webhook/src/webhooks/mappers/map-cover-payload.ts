import type { CoverEntity } from "@stakload/database";

import type { CoverWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseImageAsset, readId } from "./shared/mapper-utils";

export const mapCoverPayload = (payload: CoverWebhookPayload): Partial<CoverEntity> => ({
  ...mapBaseImageAsset(payload),
  gameId: readId(payload.game) ?? 0,
});
