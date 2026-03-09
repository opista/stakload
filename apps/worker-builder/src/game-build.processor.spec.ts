import { Mocked, TestBed } from "@suites/unit";
import type { Job } from "bullmq";

import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import { GAME_BUILD_IN_PROGRESS_SET_KEY } from "./constants";
import { GameBuildProcessor, type GameBuildJobPayload } from "./game-build.processor";

describe("GameBuildProcessor", () => {
  let logger: Mocked<PinoLogger>;
  let processor: GameBuildProcessor;
  let redisService: Mocked<RedisService>;

  const createJob = (gameId: number): Job<GameBuildJobPayload, void, string> =>
    ({
      data: { gameId },
    }) as Job<GameBuildJobPayload, void, string>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(GameBuildProcessor).compile();

    processor = unit;
    logger = unitRef.get(PinoLogger);
    redisService = unitRef.get(RedisService);
  });

  it("should add the game to the in-progress Redis set when processing", async () => {
    void redisService.sadd.mockResolvedValueOnce(1);
    const job = createJob(42);

    await processor.process(job);

    expect(redisService.sadd).toHaveBeenCalledWith(GAME_BUILD_IN_PROGRESS_SET_KEY, 42);
    expect(logger.info).toHaveBeenCalledWith({ gameId: 42 }, "Processing build job");
  });

  it("should log completed jobs with the game id", () => {
    const job = createJob(7);

    processor.onCompleted(job);

    expect(logger.info).toHaveBeenCalledWith({ gameId: 7 }, "Successfully completed build job");
  });

  it("should log failed jobs with the error and game id", () => {
    const error = new Error("build failed");
    const job = createJob(15);

    processor.onFailed(job, error);

    expect(logger.error).toHaveBeenCalledWith({ err: error, gameId: 15 }, "Failed to build game");
  });
});
