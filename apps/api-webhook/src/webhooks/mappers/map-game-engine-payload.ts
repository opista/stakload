import type { GameEngineEntity } from "@stakload/database";

import type { GameEngineWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged, readIds, readOptionalId, readString } from "./shared/mapper-utils";

export const mapGameEnginePayload = (payload: GameEngineWebhookPayload): Partial<GameEngineEntity> => ({
  ...mapBaseSlugged(payload),
  companyIds: readIds(payload.companies),
  description: readString(payload.description),
  logoId: readOptionalId(payload.logo),
  platformIds: readIds(payload.platforms),
});
