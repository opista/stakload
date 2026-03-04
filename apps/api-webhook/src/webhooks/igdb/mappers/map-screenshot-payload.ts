import type { ScreenshotEntity } from "@stakload/database";

import type { ScreenshotWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseImageAsset, readId } from "./shared/mapper-utils";

export const mapScreenshotPayload = (payload: ScreenshotWebhookPayload): Partial<ScreenshotEntity> => ({
  ...mapBaseImageAsset(payload),
  gameId: readId(payload.game) ?? 0,
});
