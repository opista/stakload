import { Body, Controller, HttpCode, Param, Post, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import type { Response } from "express";

import { PinoLogger } from "@stakload/nestjs-logging";

import { IgdbWebhookSecretGuard } from "./guards/igdb-webhook-secret.guard";
import { IgdbTombstoneInterceptor } from "./interceptors/igdb-tombstone.interceptor";
import { ParseIgdbWebhookActionPipe } from "./pipes/parse-igdb-webhook-action.pipe";
import { ParseIgdbWebhookResourcePipe } from "./pipes/parse-igdb-webhook-resource.pipe";
import { IgdbWebhookHandlerResolver } from "./services/igdb-webhook-handler.resolver";
import { WebhookGameBuildOrchestratorService } from "./services/webhook-game-build-orchestrator.service";
import type { RawIgdbPayload, WebhookAction, WebhookResource } from "./types/igdb-webhook.types";

@Controller("webhooks")
@UseGuards(IgdbWebhookSecretGuard)
@UseInterceptors(IgdbTombstoneInterceptor)
export class IgdbWebhookController {
  constructor(
    private readonly handlerResolver: IgdbWebhookHandlerResolver,
    private readonly webhookGameBuildOrchestratorService: WebhookGameBuildOrchestratorService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Post(":resource/:action")
  @HttpCode(204)
  async handleWebhook(
    @Body() payload: RawIgdbPayload,
    @Param("action", ParseIgdbWebhookActionPipe) action: WebhookAction,
    @Param("resource", ParseIgdbWebhookResourcePipe) resource: WebhookResource,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    this.logger.info({ action, igdbId: payload.id, resource }, "Received IGDB webhook");
    const result = await this.handlerResolver.resolve(resource, action, payload);
    await this.webhookGameBuildOrchestratorService.enqueueGameBuilds({
      action,
      outcome: result.outcome,
      payload,
      resource,
    });

    response.status(result.statusCode);
    this.logger.info({ action, igdbId: payload.id, outcome: result.outcome, resource }, "Processed IGDB webhook");
  }
}
