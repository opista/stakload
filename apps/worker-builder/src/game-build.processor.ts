import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Job } from "bullmq";

import { Logger } from "@stakload/nestjs-logging";

import { GAME_BUILD_QUEUE_NAME } from "./constants";

export interface GameBuildJobPayload {
  gameId: number;
}

@Processor(GAME_BUILD_QUEUE_NAME, {
  concurrency: process.env.WORKER_BUILDER_CONCURRENCY
    ? parseInt(process.env.WORKER_BUILDER_CONCURRENCY, 10)
    : 4,
})
export class GameBuildProcessor extends WorkerHost {
  constructor(private readonly logger: Logger) {
    super();
  }

  @OnWorkerEvent("completed")
  onCompleted(job: Job<GameBuildJobPayload, void, string>): void {
    this.logger.log(`Successfully completed build job for gameId: ${job.data.gameId}`, GameBuildProcessor.name);
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job<GameBuildJobPayload, void, string> | undefined, error: Error): void {
    if (job) {
      this.logger.error(`Failed to build gameId: ${job.data.gameId}. Error: ${error.message}`, error.stack, GameBuildProcessor.name);
    } else {
      this.logger.error(`Job failed: ${error.message}`, error.stack, GameBuildProcessor.name);
    }
  }

  async process(job: Job<GameBuildJobPayload, void, string>): Promise<void> {
    this.logger.log(`Processing build job for gameId: ${job.data.gameId}`, GameBuildProcessor.name);
    // Placeholder for actual game build logic
  }
}
