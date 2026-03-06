import type { ArtworkTypeEntity } from "@stakload/database";

import type { ArtworkTypeWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged } from "./shared/mapper-utils";

export const mapArtworkTypePayload = (payload: ArtworkTypeWebhookPayload): Partial<ArtworkTypeEntity> =>
  mapBaseSlugged(payload);
