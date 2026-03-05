import type { ArtworkEntity } from "@stakload/database";

import type { ArtworkWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseImageAsset, readId } from "./shared/mapper-utils";

export const mapArtworkPayload = (payload: ArtworkWebhookPayload): Partial<ArtworkEntity> => ({
  ...mapBaseImageAsset(payload),
  gameId: readId(payload.game) ?? 0,
});
