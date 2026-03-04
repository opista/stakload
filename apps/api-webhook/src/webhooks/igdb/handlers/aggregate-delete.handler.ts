import { createHash } from "node:crypto";

import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";

import { IgdbTombstoneService } from "../services/igdb-tombstone.service";
import type { AggregateResourceDefinition, WebhookDispatchResult } from "../types/igdb-webhook.types";

@Injectable()
export class AggregateDeleteHandler {
  constructor(
    private readonly dataSource: DataSource,
    private readonly tombstoneService: IgdbTombstoneService,
  ) {}

  private async acquireAdvisoryLock(queryRunner: QueryRunner, resource: string, igdbId: number): Promise<void> {
    await queryRunner.query("SELECT pg_advisory_xact_lock($1, $2)", [this.hashResource(resource), igdbId]);
  }

  private hashResource(resource: string): number {
    return createHash("sha256").update(resource).digest().readInt32BE(0);
  }

  async handle(definition: AggregateResourceDefinition, igdbId: number): Promise<WebhookDispatchResult> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.acquireAdvisoryLock(queryRunner, definition.resource, igdbId);
      await definition.replaceRelations({
        manager: queryRunner.manager,
        payload: {} as never,
        resource: definition.resource,
        rootId: igdbId,
      });
      await queryRunner.manager.delete(definition.entity, { igdbId } as never);
      await this.tombstoneService.recordDeletion(definition.resource, igdbId, queryRunner.manager);

      await queryRunner.commitTransaction();

      return {
        outcome: "handled",
        statusCode: 204,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
