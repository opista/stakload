import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { OnModuleInit } from "@nestjs/common";
import { Job } from "bullmq";

import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import { AppConfigService } from "./config/app-config.service";
import { GAME_BUILD_IN_PROGRESS_SET_KEY, GAME_BUILD_QUEUE_NAME } from "./constants";
import { GameAggregateQueryService } from "./game-build/services/game-aggregate-query.service";
import { GameCacheWriteService } from "./game-build/services/game-cache-write.service";

export interface GameBuildJobPayload {
  gameId: number;
}

@Processor(GAME_BUILD_QUEUE_NAME)
export class GameBuildProcessor extends WorkerHost implements OnModuleInit {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly gameAggregateQueryService: GameAggregateQueryService,
    private readonly gameCacheWriteService: GameCacheWriteService,
    private readonly logger: PinoLogger,
    private readonly redisService: RedisService,
  ) {
    super();
    this.logger.setContext(this.constructor.name);
  }

  @OnWorkerEvent("completed")
  onCompleted(job: Job<GameBuildJobPayload, void, string>): void {
    this.logger.info({ gameId: job.data.gameId }, "Successfully completed build job");
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job<GameBuildJobPayload, void, string> | undefined, error: Error): void {
    if (job) {
      this.logger.error({ err: error, gameId: job.data.gameId }, "Failed to build game");
    } else {
      this.logger.error({ err: error }, "Job failed");
    }
  }

  onModuleInit(): void {
    const concurrency = this.appConfigService.workerBuilderConcurrency ?? 4;
    this.worker.concurrency = concurrency;
    this.logger.info({ concurrency }, "Worker concurrency set");
  }

  async process(job: Job<GameBuildJobPayload, void, string>): Promise<void> {
    const { gameId } = job.data;

    await this.redisService.sadd(GAME_BUILD_IN_PROGRESS_SET_KEY, gameId);
    this.logger.info({ gameId }, "Processing build job");

    try {
      const game = await this.gameAggregateQueryService.fetchByGameId(gameId);

      if (!game) {
        this.logger.warn({ gameId }, "Game not found in database, skipping build");
        return;
      }

      await this.gameCacheWriteService.cacheGameAndGenreDependencies(game);
      this.logger.debug({ gameId, genreCount: game.genres.length }, "Prepared game aggregate for cache build");
    } finally {
      try {
        await this.redisService.srem(GAME_BUILD_IN_PROGRESS_SET_KEY, gameId);
      } catch (error) {
        this.logger.error({ err: error, gameId }, "Failed to remove game from in-progress set");
      }
    }
  }
}
