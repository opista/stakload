import type { GameEngineEntity } from "@stakload/database";

import type { GameEngineWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged, readIds, readOptionalId, readString } from "./shared/mapper-utils";

export const mapGameEnginePayload = (payload: GameEngineWebhookPayload): Partial<GameEngineEntity> => ({
  ...mapBaseSlugged(payload),
  companies: readIds(payload.companies),
  description: readString(payload.description),
  logo: readOptionalId(payload.logo),
  platforms: readIds(payload.platforms),
});
