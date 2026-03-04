import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { IgdbUpsertService } from "../services/igdb-upsert.service";
import type { RawIgdbPayload, SimpleResourceDefinition, WebhookDispatchResult } from "../types/igdb-webhook.types";

@Injectable()
export class SimpleUpsertHandler {
  constructor(
    private readonly dataSource: DataSource,
    private readonly upsertService: IgdbUpsertService,
  ) {}

  async handle(definition: SimpleResourceDefinition, payload: RawIgdbPayload): Promise<WebhookDispatchResult> {
    const repository = this.dataSource.getRepository(definition.entity);
    const applied = await this.upsertService.upsert(
      definition.entity,
      definition.map(payload),
      definition.staleProtection,
      repository,
    );

    return {
      outcome: applied ? "handled" : "rejected_stale",
      statusCode: 204,
    };
  }
}
