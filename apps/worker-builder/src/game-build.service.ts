import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

import { Logger } from "@stakload/nestjs-logging";

import { GAME_BUILD_QUEUE_NAME } from "./constants";
import { GameBuildJobPayload } from "./game-build.processor";

@Injectable()
export class GameBuildService {
  constructor(
    @InjectQueue(GAME_BUILD_QUEUE_NAME)
    private readonly gameBuildQueue: Queue<GameBuildJobPayload>,
    private readonly logger: Logger,
  ) {}

  async enqueueBuildJob(gameId: number): Promise<void> {
    const jobId = `build_game_${gameId}`;

    // By passing a determinist jobId, BullMQ naturally handles deduplication.
    // If a job with the same ID already exists in the queue (and hasn't finished),
    // BullMQ will ignore the duplicate add request.
    const job = await this.gameBuildQueue.add(
      "build",
      { gameId },
      { jobId },
    );

    this.logger.log(`Enqueued build job for gameId: ${gameId} with jobId: ${job.id}`, GameBuildService.name);
  }
}
