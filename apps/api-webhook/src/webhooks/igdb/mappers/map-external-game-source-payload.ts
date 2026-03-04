import type { ExternalGameSourceEntity } from "@stakload/database";

import type { ExternalGameSourceWebhookPayload } from "../types/igdb-webhook.types";
import { mapBaseNamed } from "./shared/mapper-utils";

export const mapExternalGameSourcePayload = (
  payload: ExternalGameSourceWebhookPayload,
): Partial<ExternalGameSourceEntity> => mapBaseNamed(payload);
