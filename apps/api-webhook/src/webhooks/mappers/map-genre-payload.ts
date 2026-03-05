import type { GenreEntity } from "@stakload/database";

import type { GenreWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged } from "./shared/mapper-utils";

export const mapGenrePayload = (payload: GenreWebhookPayload): Partial<GenreEntity> => mapBaseSlugged(payload);
