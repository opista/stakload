import type { WebhookAction, WebhookResource } from "../../webhooks/types/igdb-webhook.types";

export class WebhookOperationErrorDto {
  action!: WebhookAction | null;
  message!: string;
  operation!: "create" | "delete";
  resource!: WebhookResource | null;
  statusCode!: number | null;
  webhookId!: number | null;
}
