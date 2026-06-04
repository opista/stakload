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
  payload: DeleteWebhookPayload | RawIgdbPayload | null | undefined;
  resource: WebhookResource;
}

const QUEUE_CHUNK_SIZE = 100;
const QUEUE_ADD_ATTEMPTS = 3;
const QUEUEABLE_WEBHOOK_OUTCOMES: readonly WebhookOutcome[] = ["handled", "rejected_stale"];

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

  private async enqueueGameBuildChunk(gameIds: number[]): Promise<void> {
    const jobs = gameIds.map((gameId) => ({
      data: { gameId },
      name: GAME_BUILD_JOB_NAME,
      opts: buildGameBuildJobOptions(gameId),
    }));
    let lastError: unknown;

    for (let attempt = 1; attempt <= QUEUE_ADD_ATTEMPTS; attempt += 1) {
      try {
        await this.gameBuildQueue.addBulk(jobs);
        return;
      } catch (error) {
        lastError = error;

        if (attempt < QUEUE_ADD_ATTEMPTS) {
          this.logger.warn(
            { attempt, err: error, gameCount: gameIds.length, maxAttempts: QUEUE_ADD_ATTEMPTS },
            "Failed to queue game build jobs, retrying",
          );
        }
      }
    }

    throw lastError;
  }

  private async enqueueGames(gameIds: number[]): Promise<void> {
    for (let index = 0; index < gameIds.length; index += QUEUE_CHUNK_SIZE) {
      const chunk = gameIds.slice(index, index + QUEUE_CHUNK_SIZE);
      const pipeline = this.redisService.client.multi();

      for (const gameId of chunk) {
        pipeline.incr(buildGameBuildRequestedVersionKey(gameId));
      }

      await pipeline.exec();
      await this.enqueueGameBuildChunk(chunk);
    }
  }

  private parseGameIdsFromRedisMembers(members: string[]): number[] {
    return members
      .filter((member) => /^\d+$/u.test(member))
      .map((member) => Number(member))
      .filter((gameId) => Number.isInteger(gameId) && gameId > 0);
  }

  private parsePayloadId(payload: DeleteWebhookPayload | RawIgdbPayload | null | undefined): number {
    const payloadId = payload?.id;

    if (typeof payloadId !== "number" || !Number.isInteger(payloadId)) {
      throw new Error("Webhook payload must include an integer id before enqueueing game rebuilds");
    }

    return payloadId;
  }

  private parsePayloadReferenceId(value: unknown): number | null {
    if (typeof value === "number" && Number.isInteger(value) && value > 0) {
      return value;
    }

    if (typeof value === "object" && value !== null && "id" in value) {
      return this.parsePayloadReferenceId((value as { id?: unknown }).id);
    }

    return null;
  }

  private parsePayloadReferenceIds(value: unknown): number[] {
    if (Array.isArray(value)) {
      return value
        .map((entry) => this.parsePayloadReferenceId(entry))
        .filter((gameId): gameId is number => gameId !== null);
    }

    const gameId = this.parsePayloadReferenceId(value);
    return gameId === null ? [] : [gameId];
  }

  private async resolveAffectedGameIds(
    resource: WebhookResource,
    payloadId: number,
    payload: DeleteWebhookPayload | RawIgdbPayload | null | undefined,
  ): Promise<number[]> {
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

    for (const gameId of this.resolvePayloadOwnerGameIds(payload)) {
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

  private resolvePayloadOwnerGameIds(payload: DeleteWebhookPayload | RawIgdbPayload | null | undefined): number[] {
    if (!payload) {
      return [];
    }

    const payloadRecord = payload as Record<string, unknown>;

    return [
      ...new Set([
        ...this.parsePayloadReferenceIds(payloadRecord.game),
        ...this.parsePayloadReferenceIds(payloadRecord.game_id),
        ...this.parsePayloadReferenceIds(payloadRecord.games),
      ]),
    ];
  }

  async enqueueGameBuilds(input: EnqueueGameBuildInput): Promise<void> {
    if (QUEUEABLE_WEBHOOK_OUTCOMES.includes(input.outcome) === false) {
      return;
    }

    const payloadId = this.parsePayloadId(input.payload);
    const affectedGameIds = await this.resolveAffectedGameIds(input.resource, payloadId, input.payload);

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
