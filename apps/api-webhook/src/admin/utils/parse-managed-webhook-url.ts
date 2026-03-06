import { RESOURCE_DEFINITION_MAP } from "../../webhooks/resource-definitions/igdb-resource-definitions";
import { WEBHOOK_ACTION_SET } from "../../webhooks/types/igdb-webhook.types";
import type { WebhookAction, WebhookResource } from "../../webhooks/types/igdb-webhook.types";
import { buildManagedWebhookUrl } from "./build-managed-webhook-url";
import type { ManagedWebhookIdentity } from "./managed-webhook-identity";

export const parseManagedWebhookUrl = (
  url: string | null | undefined,
  publicWebhookBaseUrl: string,
): ManagedWebhookIdentity | null => {
  if (typeof url !== "string" || url.length === 0) {
    return null;
  }

  if (url.startsWith(`${publicWebhookBaseUrl}/webhooks/`) === false) {
    return null;
  }

  const relativePath = url.slice(`${publicWebhookBaseUrl}/webhooks/`.length);
  const segments = relativePath.split("/");

  if (segments.length !== 2) {
    return null;
  }

  const [resource, action] = segments as [WebhookResource, WebhookAction];

  if (!RESOURCE_DEFINITION_MAP.has(resource) || !WEBHOOK_ACTION_SET.has(action)) {
    return null;
  }

  if (buildManagedWebhookUrl(publicWebhookBaseUrl, resource, action) !== url) {
    return null;
  }

  return {
    action,
    resource,
  };
};
