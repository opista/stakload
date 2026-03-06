import type { IgdbWebhookRecord } from "../../igdb-api/types/igdb-api.types";
import { RESOURCE_DEFINITION_MAP } from "../../webhooks/resource-definitions/igdb-resource-definitions";
import { WebhookDto } from "../dto/webhook.dto";
import { parseManagedWebhookUrl } from "../utils/parse-managed-webhook-url";

export const mapIgdbWebhookRecordToWebhookDto = (
  webhook: IgdbWebhookRecord,
  publicWebhookBaseUrl: string,
): WebhookDto => {
  const managedWebhook = parseManagedWebhookUrl(webhook.url, publicWebhookBaseUrl);

  return {
    action: managedWebhook?.action ?? null,
    active: webhook.active,
    category: webhook.category,
    createdAt: webhook.created_at,
    id: webhook.id,
    managedByService: managedWebhook !== null,
    resource: managedWebhook?.resource ?? null,
    subCategory: webhook.sub_category,
    supportedByService: managedWebhook !== null && RESOURCE_DEFINITION_MAP.has(managedWebhook.resource),
    updatedAt: webhook.updated_at,
    url: webhook.url,
  };
};
