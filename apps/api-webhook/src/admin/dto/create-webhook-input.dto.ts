import { IsIn } from "class-validator";

import { SUPPORTED_WEBHOOK_RESOURCES } from "../../webhooks/resource-definitions/igdb-resource-definitions";
import { WEBHOOK_ACTIONS } from "../../webhooks/types/igdb-webhook.types";
import type { WebhookAction, WebhookResource } from "../../webhooks/types/igdb-webhook.types";

export class CreateWebhookInputDto {
  @IsIn(WEBHOOK_ACTIONS)
  action!: WebhookAction;

  @IsIn(SUPPORTED_WEBHOOK_RESOURCES)
  resource!: WebhookResource;
}
