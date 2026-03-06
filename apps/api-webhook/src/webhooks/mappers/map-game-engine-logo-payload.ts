import type { GameEngineLogoEntity } from "@stakload/database";

import type { GameEngineLogoWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseImageAsset } from "./shared/mapper-utils";

export const mapGameEngineLogoPayload = (payload: GameEngineLogoWebhookPayload): Partial<GameEngineLogoEntity> =>
  mapBaseImageAsset(payload);
