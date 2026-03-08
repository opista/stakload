import type { FranchiseEntity } from "@stakload/database";

import type { FranchiseWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged } from "./shared/mapper-utils";

export const mapFranchisePayload = (payload: FranchiseWebhookPayload): Partial<FranchiseEntity> =>
  mapBaseSlugged(payload);
