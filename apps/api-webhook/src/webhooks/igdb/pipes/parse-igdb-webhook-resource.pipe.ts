import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

import { WEBHOOK_RESOURCE_SET } from "../types/igdb-webhook.types";
import type { WebhookResource } from "../types/igdb-webhook.types";

@Injectable()
export class ParseIgdbWebhookResourcePipe implements PipeTransform<string, WebhookResource> {
  transform(value: string): WebhookResource {
    if (WEBHOOK_RESOURCE_SET.has(value)) {
      return value as WebhookResource;
    }

    throw new BadRequestException(`Unknown IGDB resource: ${value}`);
  }
}
