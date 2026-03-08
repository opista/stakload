import type { ExternalGameEntity } from "@stakload/database";

import type { ExternalGameWebhookPayload } from "../types/igdb-webhook.types";
import { readDate, readIds, readId, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

export const mapExternalGamePayload = (payload: ExternalGameWebhookPayload): Partial<ExternalGameEntity> => ({
  checksum: readString(payload.checksum),
  countries: readIds(payload.countries),
  externalGameSource: readOptionalId(payload.external_game_source),
  game: readOptionalId(payload.game),
  gameReleaseFormat: readOptionalId(payload.game_release_format),
  igdbId: readId(payload.id) ?? 0,
  name: readString(payload.name),
  platform: readOptionalId(payload.platform),
  sourceUpdatedAt: readDate(payload.updated_at),
  uid: readString(payload.uid),
  url: readString(payload.url),
  year: readNumber(payload.year),
});
