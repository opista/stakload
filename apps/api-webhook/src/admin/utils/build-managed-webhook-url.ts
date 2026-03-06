import type { WebhookAction, WebhookResource } from "../../webhooks/types/igdb-webhook.types";

export const buildManagedWebhookUrl = (
  publicWebhookBaseUrl: string,
  resource: WebhookResource,
  action: WebhookAction,
): string => `${publicWebhookBaseUrl}/webhooks/${resource}/${action}`;
