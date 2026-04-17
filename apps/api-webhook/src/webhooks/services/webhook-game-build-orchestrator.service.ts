import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import type { Queue } from "bullmq";

import {
  buildGameBuildJobOptions,
  buildGameBuildRequestedVersionKey,
  buildGameDependencySetKey,
  GAME_BUILD_JOB_NAME,
  GAME_BUILD_QUEUE_NAME,
  GAME_RESOURCE_DEPENDENT_REFERENCE_KINDS,
  getCacheReferenceKindsForWebhookResource,
  type GameBuildJobPayload,
  type GameCacheReferenceKind,
} from "@stakload/game-cache-contracts";
import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import type {
  DeleteWebhookPayload,
  RawIgdbPayload,
  WebhookAction,
  WebhookOutcome,
  WebhookResource,
} from "../types/igdb-webhook.types";

interface EnqueueGameBuildInput {
  action: WebhookAction;
  outcome: WebhookOutcome;
  payload: DeleteWebhookPayload | RawIgdbPayload;
  resource: WebhookResource;
}

const QUEUE_CHUNK_SIZE = 100;

@Injectable()
export class WebhookGameBuildOrchestratorService {
  constructor(
    @InjectQueue(GAME_BUILD_QUEUE_NAME)
    private readonly gameBuildQueue: Queue<GameBuildJobPayload, void, string>,
    private readonly logger: PinoLogger,
    private readonly redisService: RedisService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private async enqueueGames(gameIds: number[]): Promise<void> {
    for (let index = 0; index < gameIds.length; index += QUEUE_CHUNK_SIZE) {
      const chunk = gameIds.slice(index, index + QUEUE_CHUNK_SIZE);
      await Promise.all(
        chunk.map(async (gameId) => {
          await this.redisService.client.incr(buildGameBuildRequestedVersionKey(gameId));
        }),
      );
      await this.gameBuildQueue.addBulk(
        chunk.map((gameId) => ({
          data: { gameId },
          name: GAME_BUILD_JOB_NAME,
          opts: buildGameBuildJobOptions(gameId),
        })),
      );
    }
  }

  private parseGameIdsFromRedisMembers(members: string[]): number[] {
    return members
      .map((member) => Number.parseInt(member, 10))
      .filter((gameId) => Number.isInteger(gameId) && gameId > 0);
  }

  private parsePayloadId(payload: DeleteWebhookPayload | RawIgdbPayload): number {
    const payloadId = payload.id;

    if (typeof payloadId !== "number" || !Number.isInteger(payloadId)) {
      throw new Error("Webhook payload must include an integer id before enqueueing game rebuilds");
    }

    return payloadId;
  }

  private async resolveAffectedGameIds(resource: WebhookResource, payloadId: number): Promise<number[]> {
    const affectedGameIds = new Set<number>();

    if (resource === "games") {
      affectedGameIds.add(payloadId);

      const dependentGameIds = await this.resolveDependentGameIds(GAME_RESOURCE_DEPENDENT_REFERENCE_KINDS, payloadId);
      for (const gameId of dependentGameIds) {
        affectedGameIds.add(gameId);
      }

      return Array.from(affectedGameIds);
    }

    const referenceKinds = getCacheReferenceKindsForWebhookResource(resource);
    if (!referenceKinds) {
      return [];
    }

    const dependentGameIds = await this.resolveDependentGameIds(referenceKinds, payloadId);
    for (const gameId of dependentGameIds) {
      affectedGameIds.add(gameId);
    }

    return Array.from(affectedGameIds);
  }

  private async resolveDependentGameIds(
    referenceKinds: readonly GameCacheReferenceKind[],
    referenceId: number,
  ): Promise<number[]> {
    const gameIdSets = await Promise.all(
      referenceKinds.map(async (referenceKind) => {
        const members = await this.redisService.client.smembers(buildGameDependencySetKey(referenceKind, referenceId));
        return this.parseGameIdsFromRedisMembers(members);
      }),
    );

    return gameIdSets.flatMap((ids) => ids);
  }

  async enqueueGameBuilds(input: EnqueueGameBuildInput): Promise<void> {
    if (input.outcome !== "handled") {
      return;
    }

    const payloadId = this.parsePayloadId(input.payload);
    const affectedGameIds = await this.resolveAffectedGameIds(input.resource, payloadId);

    if (affectedGameIds.length === 0) {
      this.logger.debug(
        { action: input.action, payloadId, resource: input.resource },
        "No affected games found for webhook",
      );
      return;
    }

    await this.enqueueGames(affectedGameIds);
    this.logger.info(
      {
        action: input.action,
        payloadId,
        queuedGameCount: affectedGameIds.length,
        resource: input.resource,
      },
      "Queued game build jobs from webhook",
    );
  }
}
