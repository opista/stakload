import { Type } from "class-transformer";
import { IsIn, IsInt, Min } from "class-validator";

import { SUPPORTED_WEBHOOK_RESOURCES } from "../../webhooks/igdb/resource-definitions/igdb-resource-definitions";
import type { WebhookResource } from "../../webhooks/igdb/types/igdb-webhook.types";

export class TestWebhookInputDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  entityId!: number;

  @IsIn(SUPPORTED_WEBHOOK_RESOURCES)
  resource!: WebhookResource;
}
