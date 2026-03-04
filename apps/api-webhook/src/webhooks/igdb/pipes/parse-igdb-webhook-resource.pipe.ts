import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

import { PinoLogger } from "@stakload/nestjs-logging";

import { WEBHOOK_RESOURCE_SET } from "../types/igdb-webhook.types";
import type { WebhookResource } from "../types/igdb-webhook.types";

@Injectable()
export class ParseIgdbWebhookResourcePipe implements PipeTransform<string, WebhookResource> {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(this.constructor.name);
  }

  transform(value: string): WebhookResource {
    if (WEBHOOK_RESOURCE_SET.has(value)) {
      return value as WebhookResource;
    }

    this.logger.warn({ resource: value }, "Rejected unknown IGDB webhook resource");
    throw new BadRequestException(`Unknown IGDB resource: ${value}`);
  }
}
