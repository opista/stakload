import { TestBed } from "@suites/unit";
import type { Job } from "bullmq";
import type { Mocked } from "vitest";

import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import { AppConfigService } from "./config/app-config.service";
import { GAME_BUILD_IN_PROGRESS_SET_KEY } from "./constants";
import { GameBuildProcessor, type GameBuildJobPayload } from "./game-build.processor";
import { GameAggregateQueryService } from "./game-build/services/game-aggregate-query.service";
import { GameCacheWriteService } from "./game-build/services/game-cache-write.service";
import type { GameDto } from "./models/dto/game.dto";

describe("GameBuildProcessor", () => {
  let appConfigService: Mocked<AppConfigService>;
  let gameAggregateQueryService: Mocked<GameAggregateQueryService>;
  let gameCacheWriteService: Mocked<GameCacheWriteService>;
  let logger: Mocked<PinoLogger>;
  let processor: GameBuildProcessor;
  let redisService: Mocked<RedisService>;

  const createJob = (gameId: number): Job<GameBuildJobPayload, void, string> =>
    ({
      data: { gameId },
    }) as Job<GameBuildJobPayload, void, string>;

  const createGameDto = (): GameDto => ({
    cover: null,
    firstReleaseDate: 1_704_067_200,
    genres: [{ id: 1, name: "Role-playing (RPG)" }],
    id: 42,
    name: "Example Game",
    platforms: [],
    rating: 82.5,
    summary: "Example summary",
    themes: [],
  });

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(GameBuildProcessor).compile();

    appConfigService = unitRef.get(AppConfigService) as unknown as Mocked<AppConfigService>;
    gameAggregateQueryService = unitRef.get(GameAggregateQueryService) as unknown as Mocked<GameAggregateQueryService>;
    gameCacheWriteService = unitRef.get(GameCacheWriteService) as unknown as Mocked<GameCacheWriteService>;
    processor = unit;
    logger = unitRef.get(PinoLogger) as unknown as Mocked<PinoLogger>;
    redisService = unitRef.get(RedisService) as unknown as Mocked<RedisService>;
  });

  describe("onModuleInit", () => {
    it("should set worker concurrency to the configured value", () => {
      // Mock the worker property since it normally requires BullMQ integration to populate
      Object.defineProperty(processor, "worker", {
        value: { concurrency: 0 },
        writable: true,
      });

      appConfigService.workerBuilderConcurrency = 10;
      processor.onModuleInit();

      expect(processor.worker.concurrency).toBe(10);
      expect(logger.info).toHaveBeenCalledWith({ concurrency: 10 }, "Worker concurrency set");
    });

    it("should default worker concurrency to 4 if not configured", () => {
      Object.defineProperty(processor, "worker", {
        value: { concurrency: 0 },
        writable: true,
      });

      appConfigService.workerBuilderConcurrency = undefined;
      processor.onModuleInit();

      expect(processor.worker.concurrency).toBe(4);
      expect(logger.info).toHaveBeenCalledWith({ concurrency: 4 }, "Worker concurrency set");
    });
  });

  it("should add then remove the game in-progress marker and execute the aggregate query", async () => {
    void redisService.sadd.mockResolvedValueOnce(1);
    void redisService.srem.mockResolvedValueOnce(1);
    void gameAggregateQueryService.fetchByGameId.mockResolvedValueOnce(createGameDto());
    void gameCacheWriteService.cacheGameAndGenreDependencies.mockResolvedValueOnce();
    const job = createJob(42);

    await processor.process(job);

    expect(redisService.sadd).toHaveBeenCalledWith(GAME_BUILD_IN_PROGRESS_SET_KEY, 42);
    expect(gameAggregateQueryService.fetchByGameId).toHaveBeenCalledWith(42);
    expect(gameCacheWriteService.cacheGameAndGenreDependencies).toHaveBeenCalledWith(createGameDto());
    expect(redisService.srem).toHaveBeenCalledWith(GAME_BUILD_IN_PROGRESS_SET_KEY, 42);
    expect(logger.info).toHaveBeenCalledWith({ gameId: 42 }, "Processing build job");
  });

  it("should warn and skip when the game does not exist in Postgres", async () => {
    void redisService.sadd.mockResolvedValueOnce(1);
    void redisService.srem.mockResolvedValueOnce(1);
    void gameAggregateQueryService.fetchByGameId.mockResolvedValueOnce(null);

    await expect(processor.process(createJob(404))).resolves.toBeUndefined();
    expect(gameCacheWriteService.cacheGameAndGenreDependencies).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith({ gameId: 404 }, "Game not found in database, skipping build");
  });

  it("should log debug output when an aggregated game is returned", async () => {
    void redisService.sadd.mockResolvedValueOnce(1);
    void redisService.srem.mockResolvedValueOnce(1);
    void gameAggregateQueryService.fetchByGameId.mockResolvedValueOnce(createGameDto());
    void gameCacheWriteService.cacheGameAndGenreDependencies.mockResolvedValueOnce();

    await expect(processor.process(createJob(42))).resolves.toBeUndefined();
    expect(gameCacheWriteService.cacheGameAndGenreDependencies).toHaveBeenCalledWith(createGameDto());
    expect(logger.debug).toHaveBeenCalledWith({ gameId: 42, genreCount: 1 }, "Prepared game aggregate for cache build");
  });

  it("should still complete when removing in-progress marker fails", async () => {
    const queryError = new Error("query failed");
    const cleanupError = new Error("cleanup failed");

    void redisService.sadd.mockResolvedValueOnce(1);
    void gameAggregateQueryService.fetchByGameId.mockRejectedValueOnce(queryError);
    void redisService.srem.mockRejectedValueOnce(cleanupError);

    await expect(processor.process(createJob(42))).rejects.toThrow("query failed");
    expect(logger.error).toHaveBeenCalledWith(
      { err: cleanupError, gameId: 42 },
      "Failed to remove game from in-progress set",
    );
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
