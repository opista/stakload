import type { WebhookResource } from "../../webhooks/igdb/types/igdb-webhook.types";

export class TestWebhookResultDto {
  entityId!: number;
  resource!: WebhookResource;
  result!: unknown;
  webhookId!: number;
}
