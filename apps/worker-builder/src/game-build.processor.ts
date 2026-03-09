import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Job } from "bullmq";

import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import { GAME_BUILD_IN_PROGRESS_SET_KEY, GAME_BUILD_QUEUE_NAME } from "./constants";

export interface GameBuildJobPayload {
  gameId: number;
}

@Processor(GAME_BUILD_QUEUE_NAME, {
  concurrency: process.env.WORKER_BUILDER_CONCURRENCY ? parseInt(process.env.WORKER_BUILDER_CONCURRENCY, 10) : 4,
})
export class GameBuildProcessor extends WorkerHost {
  constructor(
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

  async process(job: Job<GameBuildJobPayload, void, string>): Promise<void> {
    await this.redisService.sadd(GAME_BUILD_IN_PROGRESS_SET_KEY, job.data.gameId);
    this.logger.info({ gameId: job.data.gameId }, "Processing build job");
    // Placeholder for actual game build logic
  }
}
