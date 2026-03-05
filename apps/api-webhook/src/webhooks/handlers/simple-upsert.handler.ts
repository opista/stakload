import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { PinoLogger } from "@stakload/nestjs-logging";

import { IgdbUpsertService } from "../services/igdb-upsert.service";
import type { RawIgdbPayload, SimpleResourceDefinition, WebhookDispatchResult } from "../types/igdb-webhook.types";

@Injectable()
export class SimpleUpsertHandler {
  constructor(
    private readonly dataSource: DataSource,
    private readonly upsertService: IgdbUpsertService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async handle(definition: SimpleResourceDefinition, payload: RawIgdbPayload): Promise<WebhookDispatchResult> {
    const repository = this.dataSource.getRepository(definition.entity);
    const applied = await this.upsertService.upsert(
      definition.entity,
      definition.map(payload),
      definition.staleProtection,
      repository,
    );

    this.logger.info(
      { outcome: applied ? "handled" : "rejected_stale", resource: definition.resource },
      "Processed simple upsert webhook",
    );

    return {
      outcome: applied ? "handled" : "rejected_stale",
      statusCode: 204,
    };
  }
}
