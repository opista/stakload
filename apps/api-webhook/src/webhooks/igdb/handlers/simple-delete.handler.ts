import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { IgdbTombstoneService } from "../services/igdb-tombstone.service";
import type { SimpleResourceDefinition, WebhookDispatchResult } from "../types/igdb-webhook.types";

@Injectable()
export class SimpleDeleteHandler {
  constructor(
    private readonly dataSource: DataSource,
    private readonly tombstoneService: IgdbTombstoneService,
  ) {}

  async handle(definition: SimpleResourceDefinition, igdbId: number): Promise<WebhookDispatchResult> {
    const repository = this.dataSource.getRepository(definition.entity);

    await repository.delete({ igdbId } as never);
    await this.tombstoneService.recordDeletion(definition.resource, igdbId);

    return {
      outcome: "handled",
      statusCode: 204,
    };
  }
}
