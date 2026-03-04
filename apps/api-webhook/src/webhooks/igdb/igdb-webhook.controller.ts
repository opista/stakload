import { Body, Controller, HttpCode, Param, Post, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import type { Response } from "express";

import { IgdbWebhookSecretGuard } from "./guards/igdb-webhook-secret.guard";
import { IgdbTombstoneInterceptor } from "./interceptors/igdb-tombstone.interceptor";
import { ParseIgdbWebhookActionPipe } from "./pipes/parse-igdb-webhook-action.pipe";
import { ParseIgdbWebhookResourcePipe } from "./pipes/parse-igdb-webhook-resource.pipe";
import { IgdbWebhookHandlerResolver } from "./services/igdb-webhook-handler.resolver";
import type { RawIgdbPayload, WebhookAction, WebhookResource } from "./types/igdb-webhook.types";

@Controller("webhooks/igdb")
@UseGuards(IgdbWebhookSecretGuard)
@UseInterceptors(IgdbTombstoneInterceptor)
export class IgdbWebhookController {
  constructor(private readonly handlerResolver: IgdbWebhookHandlerResolver) {}

  @Post(":resource/:action")
  @HttpCode(204)
  async handleWebhook(
    @Body() payload: RawIgdbPayload,
    @Param("action", ParseIgdbWebhookActionPipe) action: WebhookAction,
    @Param("resource", ParseIgdbWebhookResourcePipe) resource: WebhookResource,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const result = await this.handlerResolver.resolve(resource, action, payload);

    response.status(result.statusCode);
  }
}
