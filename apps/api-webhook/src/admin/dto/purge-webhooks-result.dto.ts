import { DeleteWebhookResultDto } from "./delete-webhook-result.dto";
import { WebhookOperationErrorDto } from "./webhook-operation-error.dto";

export class PurgeWebhooksResultDto {
  deleted!: DeleteWebhookResultDto[];
  errors!: WebhookOperationErrorDto[];
  totalCandidates!: number;
}
