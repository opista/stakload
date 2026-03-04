import { BadRequestException, Injectable, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

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
  constructor(private readonly moduleRef: ModuleRef) {}

  private getHandler<THandler>(handler: Type<THandler>): THandler {
    return this.moduleRef.get<THandler>(handler, {
      strict: false,
    });
  }

  private requireId(payload: DeleteWebhookPayload | RawIgdbPayload): number {
    const value = payload.id;

    if (typeof value !== "number" || Number.isInteger(value) === false) {
      throw new BadRequestException("Webhook payload must include an integer id");
    }

    return value;
  }

  private resolveDelete(
    definition: ResourceDefinition,
    igdbId: number,
  ): Promise<WebhookDispatchResult> {
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
      return {
        outcome: "ignored_unsupported",
        statusCode: 202,
      };
    }

    if (action === "delete") {
      const igdbId = this.requireId(payload);
      return this.resolveDelete(definition, igdbId);
    }

    return this.resolveUpsert(definition, action, payload as RawIgdbPayload);
  }
}
