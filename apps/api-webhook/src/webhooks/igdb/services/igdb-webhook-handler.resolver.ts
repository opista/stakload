import { BadRequestException, Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { PinoLogger } from "@stakload/nestjs-logging";

import { AggregateDeleteHandler } from "../handlers/aggregate-delete.handler";
import { AggregateUpsertHandler } from "../handlers/aggregate-upsert.handler";
import { SimpleDeleteHandler } from "../handlers/simple-delete.handler";
import { SimpleUpsertHandler } from "../handlers/simple-upsert.handler";
import { RESOURCE_DEFINITION_MAP } from "../resource-definitions/igdb-resource-definitions";
import type {
  DeleteWebhookPayload,
  RawIgdbPayload,
  ResourceDefinition,
  WebhookAction,
  WebhookDispatchResult,
  WebhookResource,
} from "../types/igdb-webhook.types";

const HANDLER_MAP = {
  aggregate: {
    create: AggregateUpsertHandler,
    delete: AggregateDeleteHandler,
    update: AggregateUpsertHandler,
  },
  simple: {
    create: SimpleUpsertHandler,
    delete: SimpleDeleteHandler,
    update: SimpleUpsertHandler,
  },
} as const;

@Injectable()
export class IgdbWebhookHandlerResolver {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private getHandler<THandler>(handler: Type<THandler>): THandler {
    return this.moduleRef.get<THandler>(handler, {
      strict: false,
    });
  }

  private requireId(payload: DeleteWebhookPayload | RawIgdbPayload): number {
    const value = payload.id;

    if (typeof value !== "number" || Number.isInteger(value) === false) {
      this.logger.warn("Rejected delete webhook payload without an integer id");
      throw new BadRequestException("Webhook payload must include an integer id");
    }

    return value;
  }

  private resolveDelete(definition: ResourceDefinition, igdbId: number): Promise<WebhookDispatchResult> {
    if (definition.kind === "aggregate") {
      const handler = this.getHandler(HANDLER_MAP.aggregate.delete);

      return handler.handle(definition, igdbId);
    }

    const handler = this.getHandler(HANDLER_MAP.simple.delete);

    return handler.handle(definition, igdbId);
  }

  private resolveUpsert(
    definition: ResourceDefinition,
    action: Exclude<WebhookAction, "delete">,
    payload: RawIgdbPayload,
  ): Promise<WebhookDispatchResult> {
    if (definition.kind === "aggregate") {
      const handler = this.getHandler(HANDLER_MAP.aggregate[action]);
      return handler.handle(definition, payload);
    }

    const handler = this.getHandler(HANDLER_MAP.simple[action]);
    return handler.handle(definition, payload);
  }

  async resolve(
    resource: WebhookResource,
    action: WebhookAction,
    payload: DeleteWebhookPayload | RawIgdbPayload,
  ): Promise<WebhookDispatchResult> {
    const definition = RESOURCE_DEFINITION_MAP.get(resource);

    if (!definition) {
      this.logger.info({ action, igdbId: payload.id, resource }, "Ignoring unsupported IGDB resource");
      return {
        outcome: "ignored_unsupported",
        statusCode: 202,
      };
    }

    this.logger.debug({ action, kind: definition.kind, resource }, "Resolved IGDB webhook handler");

    if (action === "delete") {
      const igdbId = this.requireId(payload);
      return this.resolveDelete(definition, igdbId);
    }

    return this.resolveUpsert(definition, action, payload as RawIgdbPayload);
  }
}
