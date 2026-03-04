import { createHash } from "node:crypto";

import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";

import { PinoLogger } from "@stakload/nestjs-logging";

import { IgdbUpsertService } from "../services/igdb-upsert.service";
import type { AggregateResourceDefinition, RawIgdbPayload, WebhookDispatchResult } from "../types/igdb-webhook.types";

@Injectable()
export class AggregateUpsertHandler {
  constructor(
    private readonly dataSource: DataSource,
    private readonly upsertService: IgdbUpsertService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private async acquireAdvisoryLock(queryRunner: QueryRunner, resource: string, igdbId: number): Promise<void> {
    await queryRunner.query("SELECT pg_advisory_xact_lock($1, $2)", [this.hashResource(resource), igdbId]);
  }

  private hashResource(resource: string): number {
    return createHash("sha256").update(resource).digest().readInt32BE(0);
  }

  async handle(definition: AggregateResourceDefinition, payload: RawIgdbPayload): Promise<WebhookDispatchResult> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const mappedPayload = definition.map(payload);
      const igdbId = mappedPayload.igdbId;

      if (typeof igdbId !== "number") {
        this.logger.error({ resource: definition.resource }, "Aggregate payload is missing igdbId");
        throw new Error(`Missing igdbId for aggregate resource ${definition.resource}`);
      }

      await this.acquireAdvisoryLock(queryRunner, definition.resource, igdbId);

      const applied = await this.upsertService.upsert(
        definition.entity,
        mappedPayload,
        definition.staleProtection,
        queryRunner,
      );

      if (applied) {
        await definition.replaceRelations({
          manager: queryRunner.manager,
          payload,
          resource: definition.resource,
          rootId: igdbId,
        });
      }

      this.logger.info(
        { igdbId, outcome: applied ? "handled" : "rejected_stale", resource: definition.resource },
        "Processed aggregate upsert webhook",
      );

      await queryRunner.commitTransaction();

      return {
        outcome: applied ? "handled" : "rejected_stale",
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
