import type { ThemeEntity } from "@stakload/database";

import type { ThemeWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged } from "./shared/mapper-utils";

export const mapThemePayload = (payload: ThemeWebhookPayload): Partial<ThemeEntity> => mapBaseSlugged(payload);
