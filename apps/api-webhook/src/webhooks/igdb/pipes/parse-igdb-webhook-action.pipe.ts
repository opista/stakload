import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

import { PinoLogger } from "@stakload/nestjs-logging";

import { WEBHOOK_ACTION_SET } from "../types/igdb-webhook.types";
import type { WebhookAction } from "../types/igdb-webhook.types";

@Injectable()
export class ParseIgdbWebhookActionPipe implements PipeTransform<string, WebhookAction> {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(this.constructor.name);
  }

  transform(value: string): WebhookAction {
    if (WEBHOOK_ACTION_SET.has(value)) {
      return value as WebhookAction;
    }

    this.logger.warn({ action: value }, "Rejected unknown IGDB webhook action");
    throw new BadRequestException(`Unsupported webhook action: ${value}`);
  }
}
