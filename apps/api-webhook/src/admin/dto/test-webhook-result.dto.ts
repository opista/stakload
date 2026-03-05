import type { WebhookResource } from "../../webhooks/types/igdb-webhook.types";

export class TestWebhookResultDto {
  entityId!: number;
  resource!: WebhookResource;
  result!: unknown;
  webhookId!: number;
}
