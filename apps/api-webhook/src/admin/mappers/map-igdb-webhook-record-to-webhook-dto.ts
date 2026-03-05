import type { IgdbWebhookRecord } from "../../igdb-api/types/igdb-api.types";
import { RESOURCE_DEFINITION_MAP } from "../../webhooks/igdb/resource-definitions/igdb-resource-definitions";
import { WEBHOOK_ACTION_SET } from "../../webhooks/igdb/types/igdb-webhook.types";
import type { WebhookAction, WebhookResource } from "../../webhooks/igdb/types/igdb-webhook.types";
import { WebhookDto } from "../dto/webhook.dto";

const parseManagedWebhookUrl = (
  url: string,
  publicWebhookBaseUrl: string,
): { action: WebhookAction; resource: WebhookResource } | null => {
  if (url.startsWith(`${publicWebhookBaseUrl}/webhooks/igdb/`) === false) {
    return null;
  }

  const relativePath = url.slice(`${publicWebhookBaseUrl}/webhooks/igdb/`.length);
  const segments = relativePath.split("/");

  if (segments.length !== 2) {
    return null;
  }

  const [resource, action] = segments;

  if (RESOURCE_DEFINITION_MAP.has(resource as WebhookResource) === false || WEBHOOK_ACTION_SET.has(action) === false) {
    return null;
  }

  if (`${publicWebhookBaseUrl}/webhooks/igdb/${resource}/${action}` !== url) {
    return null;
  }

  return {
    action: action as WebhookAction,
    resource: resource as WebhookResource,
  };
};

export const mapIgdbWebhookRecordToWebhookDto = (
  webhook: IgdbWebhookRecord,
  publicWebhookBaseUrl: string,
): WebhookDto => {
  const managedWebhook = parseManagedWebhookUrl(webhook.url, publicWebhookBaseUrl);

  return {
    action: managedWebhook?.action ?? null,
    active: webhook.active,
    apiKey: webhook.api_key,
    category: webhook.category,
    createdAt: webhook.created_at,
    id: webhook.id,
    managedByService: managedWebhook !== null,
    resource: managedWebhook?.resource ?? null,
    secret: webhook.secret,
    subCategory: webhook.sub_category,
    supportedByService: managedWebhook !== null && RESOURCE_DEFINITION_MAP.has(managedWebhook.resource),
    updatedAt: webhook.updated_at,
    url: webhook.url,
  };
};
