import type { WebhookAction, WebhookResource } from "../../webhooks/types/igdb-webhook.types";

export interface ManagedWebhookIdentity {
  action: WebhookAction;
  resource: WebhookResource;
}
