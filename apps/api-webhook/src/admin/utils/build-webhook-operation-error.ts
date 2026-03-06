import { IgdbApiError } from "../../igdb-api/types/igdb-api.types";
import type { WebhookAction, WebhookResource } from "../../webhooks/types/igdb-webhook.types";
import type { WebhookOperationErrorDto } from "../dto/webhook-operation-error.dto";

interface BuildWebhookOperationErrorInput {
  action: WebhookAction | null;
  error: unknown;
  operation: "create" | "delete";
  resource: WebhookResource | null;
  webhookId: number | null;
}

export const buildWebhookOperationError = (input: BuildWebhookOperationErrorInput): WebhookOperationErrorDto => {
  const statusCode = input.error instanceof IgdbApiError ? input.error.statusCode : null;
  const message =
    input.error instanceof Error ? input.error.message : `Unexpected ${input.operation} webhook reconciliation error`;

  return {
    action: input.action,
    message,
    operation: input.operation,
    resource: input.resource,
    statusCode,
    webhookId: input.webhookId,
  };
};
