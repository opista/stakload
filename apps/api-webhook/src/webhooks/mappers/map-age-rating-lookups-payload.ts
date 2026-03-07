import type {
  AgeRatingCategoryEntity,
  AgeRatingContentDescriptionV2Entity,
  AgeRatingOrganizationEntity,
} from "@stakload/database";

import type {
  AgeRatingCategoryWebhookPayload,
  AgeRatingContentDescriptionV2WebhookPayload,
  AgeRatingOrganizationWebhookPayload,
} from "../types/igdb-webhook.types";
import { mapBaseNamed, readDate, readId, readOptionalId, readString } from "./shared/mapper-utils";

export const mapAgeRatingOrganizationPayload = (
  payload: AgeRatingOrganizationWebhookPayload,
): Partial<AgeRatingOrganizationEntity> => mapBaseNamed(payload);

export const mapAgeRatingCategoryPayload = (
  payload: AgeRatingCategoryWebhookPayload,
): Partial<AgeRatingCategoryEntity> => ({
  checksum: readString(payload.checksum),
  igdbId: readId(payload.id) ?? 0,
  organization: readOptionalId(payload.organization),
  rating: readString(payload.rating),
  sourceUpdatedAt: readDate(payload.updated_at),
});

export const mapAgeRatingContentDescriptionV2Payload = (
  payload: AgeRatingContentDescriptionV2WebhookPayload,
): Partial<AgeRatingContentDescriptionV2Entity> => ({
  checksum: readString(payload.checksum),
  description: readString(payload.description),
  igdbId: readId(payload.id) ?? 0,
  organization: readOptionalId(payload.organization),
  sourceUpdatedAt: readDate(payload.updated_at),
});
