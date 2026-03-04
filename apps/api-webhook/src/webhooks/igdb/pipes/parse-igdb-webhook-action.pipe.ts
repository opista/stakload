import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

import { WEBHOOK_ACTION_SET } from "../types/igdb-webhook.types";
import type { WebhookAction } from "../types/igdb-webhook.types";

@Injectable()
export class ParseIgdbWebhookActionPipe implements PipeTransform<string, WebhookAction> {
  transform(value: string): WebhookAction {
    if (WEBHOOK_ACTION_SET.has(value)) {
      return value as WebhookAction;
    }

    throw new BadRequestException(`Unsupported webhook action: ${value}`);
  }
}
