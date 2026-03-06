import { DeleteWebhookResultDto } from "./delete-webhook-result.dto";
import { WebhookOperationErrorDto } from "./webhook-operation-error.dto";
import { WebhookDto } from "./webhook.dto";

export class SyncWebhooksResultDto {
  created!: WebhookDto[];
  deduplicated!: DeleteWebhookResultDto[];
  desiredCount!: number;
  errors!: WebhookOperationErrorDto[];
  existingManagedCount!: number;
  keptCount!: number;
}
