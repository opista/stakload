import type { WebhookAction, WebhookResource } from "../../webhooks/types/igdb-webhook.types";

export const buildManagedWebhookKey = (resource: WebhookResource, action: WebhookAction): string =>
  `${resource}:${action}`;
