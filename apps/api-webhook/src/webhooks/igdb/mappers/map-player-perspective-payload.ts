import type { PlayerPerspectiveEntity } from "@stakload/database";

import type { PlayerPerspectiveWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged } from "./shared/mapper-utils";

export const mapPlayerPerspectivePayload = (
  payload: PlayerPerspectiveWebhookPayload,
): Partial<PlayerPerspectiveEntity> => mapBaseSlugged(payload);
