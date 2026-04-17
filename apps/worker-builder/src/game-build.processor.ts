import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { OnModuleInit } from "@nestjs/common";
import { Job, type Queue } from "bullmq";

import {
  buildGameBuildAttemptedVersionKey,
  buildGameBuildJobOptions,
  buildGameBuildRequestedVersionKey,
  GAME_BUILD_JOB_NAME,
  GAME_BUILD_IN_PROGRESS_SET_KEY,
  GAME_BUILD_QUEUE_NAME,
  type GameBuildJobPayload,
} from "@stakload/game-cache-contracts";
import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import { AppConfigService } from "./config/app-config.service";
import { GameAggregateQueryService } from "./game-build/services/game-aggregate-query.service";
import { GameCacheWriteService } from "./game-build/services/game-cache-write.service";

const parseRedisVersion = (value: string | null): number | null => {
  if (value === null) {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

@Processor(GAME_BUILD_QUEUE_NAME)
export class GameBuildProcessor extends WorkerHost implements OnModuleInit {
  constructor(
    @InjectQueue(GAME_BUILD_QUEUE_NAME)
    private readonly gameBuildQueue: Queue<GameBuildJobPayload, void, string>,
    private readonly appConfigService: AppConfigService,
    private readonly gameAggregateQueryService: GameAggregateQueryService,
    private readonly gameCacheWriteService: GameCacheWriteService,
    private readonly logger: PinoLogger,
    private readonly redisService: RedisService,
  ) {
    super();
    this.logger.setContext(this.constructor.name);
  }

  private async markAttemptedBuildVersion(gameId: number, requestedVersion: number): Promise<void> {
    await this.redisService.client.set(buildGameBuildAttemptedVersionKey(gameId), String(requestedVersion));
  }

  private async processLatestRequestedBuild(gameId: number): Promise<void> {
    while (true) {
      const requestedVersion = await this.resolveRequestedBuildVersion(gameId);
      await this.processRequestedBuildVersion(gameId, requestedVersion);

      const latestRequestedVersion = await this.readRequestedBuildVersion(gameId);
      if (latestRequestedVersion === null || latestRequestedVersion <= requestedVersion) {
        return;
      }

      this.logger.info(
        {
          gameId,
          latestRequestedVersion,
          requestedVersion,
        },
        "Detected newer requested build version, continuing current job",
      );
    }
  }

  private async processRequestedBuildVersion(gameId: number, requestedVersion: number): Promise<void> {
    await this.markAttemptedBuildVersion(gameId, requestedVersion);

    const game = await this.gameAggregateQueryService.fetchByGameId(gameId);

    if (!game) {
      await this.gameCacheWriteService.purgeGameAndDependencies(gameId);
      this.logger.warn({ gameId, requestedVersion }, "Game not found in database, purged cached game payload");
      return;
    }

    await this.gameCacheWriteService.cacheGameAndDependencies(game);
    this.logger.debug({ gameId, requestedVersion }, "Prepared game aggregate for cache build");
  }

  private async queueReplacementBuildIfNeeded(gameId: number, outcome: "completed" | "failed"): Promise<void> {
    const [requestedVersion, attemptedVersion] = await Promise.all([
      this.readRequestedBuildVersion(gameId),
      this.readAttemptedBuildVersion(gameId),
    ]);

    if (requestedVersion === null || attemptedVersion === null || requestedVersion <= attemptedVersion) {
      return;
    }

    await this.gameBuildQueue.add(GAME_BUILD_JOB_NAME, { gameId }, buildGameBuildJobOptions(gameId));
    this.logger.warn(
      {
        attemptedVersion,
        gameId,
        outcome,
        requestedVersion,
      },
      "Queued fresh build job for newer requested version",
    );
  }

  private async readAttemptedBuildVersion(gameId: number): Promise<number | null> {
    return this.readBuildVersion(buildGameBuildAttemptedVersionKey(gameId));
  }

  private async readBuildVersion(key: string): Promise<number | null> {
    const value = await this.redisService.client.get(key);
    return parseRedisVersion(value);
  }

  private async readRequestedBuildVersion(gameId: number): Promise<number | null> {
    return this.readBuildVersion(buildGameBuildRequestedVersionKey(gameId));
  }

  private async resolveRequestedBuildVersion(gameId: number): Promise<number> {
    const requestedVersion = await this.readRequestedBuildVersion(gameId);
    if (requestedVersion !== null) {
      return requestedVersion;
    }

    const initialVersion = await this.redisService.client.incr(buildGameBuildRequestedVersionKey(gameId));
    this.logger.warn(
      { gameId, requestedVersion: initialVersion },
      "Initialised missing requested build version for queued job",
    );
    return initialVersion;
  }

  @OnWorkerEvent("completed")
  async onCompleted(job: Job<GameBuildJobPayload, void, string>): Promise<void> {
    this.logger.info({ gameId: job.data.gameId }, "Successfully completed build job");

    try {
      await this.queueReplacementBuildIfNeeded(job.data.gameId, "completed");
    } catch (error) {
      this.logger.error({ err: error, gameId: job.data.gameId }, "Failed to reconcile completed build job");
    }
  }

  @OnWorkerEvent("failed")
  async onFailed(job: Job<GameBuildJobPayload, void, string> | undefined, error: Error): Promise<void> {
    if (job) {
      this.logger.error({ err: error, gameId: job.data.gameId }, "Failed to build game");

      try {
        await this.queueReplacementBuildIfNeeded(job.data.gameId, "failed");
      } catch (requeueError) {
        this.logger.error({ err: requeueError, gameId: job.data.gameId }, "Failed to reconcile failed build job");
      }
    } else {
      this.logger.error({ err: error }, "Job failed");
    }
  }

  onModuleInit(): void {
    const concurrency = this.appConfigService.workerBuilderConcurrency;
    this.worker.concurrency = concurrency;
    this.logger.info({ concurrency }, "Worker concurrency set");
  }

  async process(job: Job<GameBuildJobPayload, void, string>): Promise<void> {
    const { gameId } = job.data;

    await this.redisService.sadd(GAME_BUILD_IN_PROGRESS_SET_KEY, gameId);
    this.logger.info({ gameId }, "Processing build job");

    try {
      await this.processLatestRequestedBuild(gameId);
    } finally {
      try {
        await this.redisService.srem(GAME_BUILD_IN_PROGRESS_SET_KEY, gameId);
      } catch (error) {
        this.logger.error({ err: error, gameId }, "Failed to remove game from in-progress set");
      }
    }
  }
}
