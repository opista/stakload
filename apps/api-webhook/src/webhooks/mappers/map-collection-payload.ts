import type { CollectionEntity } from "@stakload/database";

import type { CollectionWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged, readString } from "./shared/mapper-utils";

export const mapCollectionPayload = (payload: CollectionWebhookPayload): Partial<CollectionEntity> => ({
  ...mapBaseSlugged(payload),
  description: readString(payload.description),
});
