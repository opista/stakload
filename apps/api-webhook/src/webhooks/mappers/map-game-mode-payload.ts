import type { GameModeEntity } from "@stakload/database";

import type { GameModeWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged } from "./shared/mapper-utils";

export const mapGameModePayload = (payload: GameModeWebhookPayload): Partial<GameModeEntity> => mapBaseSlugged(payload);
