import type { KeywordEntity } from "@stakload/database";

import type { KeywordWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseSlugged } from "./shared/mapper-utils";

export const mapKeywordPayload = (payload: KeywordWebhookPayload): Partial<KeywordEntity> => mapBaseSlugged(payload);
