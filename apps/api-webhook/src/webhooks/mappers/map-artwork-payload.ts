import type { ArtworkEntity } from "@stakload/database";

import type { ArtworkWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseImageAsset, readId, readOptionalId } from "./shared/mapper-utils";

export const mapArtworkPayload = (payload: ArtworkWebhookPayload): Partial<ArtworkEntity> => ({
  ...mapBaseImageAsset(payload),
  artworkType: readOptionalId(payload.artwork_type),
  game: readId(payload.game) ?? 0,
});
