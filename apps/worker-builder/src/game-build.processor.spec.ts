import type { Job, Queue } from "bullmq";

import {
  buildGameBuildAttemptedVersionKey,
  buildGameBuildJobOptions,
  buildGameBuildRequestedVersionKey,
  GAME_BUILD_IN_PROGRESS_SET_KEY,
  GAME_BUILD_JOB_NAME,
  type GameBuildJobPayload,
} from "@stakload/game-cache-contracts";
import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import { AppConfigService } from "./config/app-config.service";
import { GameBuildProcessor } from "./game-build.processor";
import { GameAggregateQueryService } from "./game-build/services/game-aggregate-query.service";
import { GameCacheWriteService } from "./game-build/services/game-cache-write.service";
import type { GameDto } from "./models/dto/game.dto";

describe("GameBuildProcessor", () => {
  const createJob = (gameId: number): Job<GameBuildJobPayload, void, string> =>
    ({
      data: { gameId },
    }) as Job<GameBuildJobPayload, void, string>;

  const createGameDto = (): GameDto => ({
    ageRatings: [],
    aggregatedRating: null,
    aggregatedRatingCount: null,
    alternativeNames: [],
    artworks: [],
    bundles: [],
    checksum: null,
    collections: [],
    cover: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    developers: [],
    externalGames: [],
    firstReleaseDate: 1_704_067_200,
    franchise: null,
    franchises: [],
    gameEngines: [],
    gameModes: [],
    gameStatus: null,
    gameType: null,
    genres: [{ id: 1, name: "Role-playing (RPG)" }],
    id: 42,
    involvedCompanies: [],
    keywords: [],
    languageSupports: [],
    multiplayerModes: [],
    name: "Example Game",
    parentGame: null,
    platforms: [],
    playerPerspectives: [],
    publishers: [],
    rating: 82.5,
    ratingCount: null,
    screenshots: [],
    similarGames: [],
    slug: null,
    sourceUpdatedAt: null,
    storyline: null,
    summary: "Example summary",
    themes: [],
    totalRating: null,
    totalRatingCount: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    url: null,
    versionParent: null,
    versionTitle: null,
    videos: [],
    websites: [],
  });

  const createProcessor = ({
    initialAttemptedVersions = {},
    initialRequestedVersions = {},
  }: {
    initialAttemptedVersions?: Record<number, number>;
    initialRequestedVersions?: Record<number, number>;
  } = {}) => {
    const redisValues = new Map<string, number>();

    for (const [gameId, version] of Object.entries(initialRequestedVersions)) {
      redisValues.set(buildGameBuildRequestedVersionKey(Number(gameId)), version);
    }

    for (const [gameId, version] of Object.entries(initialAttemptedVersions)) {
      redisValues.set(buildGameBuildAttemptedVersionKey(Number(gameId)), version);
    }

    const add = vi.fn().mockResolvedValue(undefined);
    const fetchByGameId = vi.fn();
    const cacheGameAndDependencies = vi.fn();
    const purgeGameAndDependencies = vi.fn();
    const logger = {
      debug: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      setContext: vi.fn(),
      warn: vi.fn(),
    };
    const redisClient = {
      get: vi.fn(async (key: string) => {
        if (!redisValues.has(key)) {
          return null;
        }

        return String(redisValues.get(key));
      }),
      incr: vi.fn(async (key: string) => {
        const nextVersion = (redisValues.get(key) ?? 0) + 1;
        redisValues.set(key, nextVersion);
        return nextVersion;
      }),
      set: vi.fn(async (key: string, value: string) => {
        redisValues.set(key, Number.parseInt(value, 10));
        return "OK";
      }),
    };
    const redisService = {
      sadd: vi.fn().mockResolvedValue(1),
      srem: vi.fn().mockResolvedValue(1),
    } as unknown as RedisService;
    const appConfigService = {} as AppConfigService;

    Object.defineProperty(appConfigService, "workerBuilderConcurrency", {
      configurable: true,
      value: 10,
    });
    Object.defineProperty(redisService, "client", {
      configurable: true,
      value: redisClient,
    });

    const processor = new GameBuildProcessor(
      { add } as unknown as Queue<GameBuildJobPayload, void, string>,
      appConfigService,
      { fetchByGameId } as unknown as GameAggregateQueryService,
      {
        cacheGameAndDependencies,
        purgeGameAndDependencies,
      } as unknown as GameCacheWriteService,
      logger as unknown as PinoLogger,
      redisService,
    );

    return {
      add,
      appConfigService,
      cacheGameAndDependencies,
      fetchByGameId,
      logger,
      processor,
      purgeGameAndDependencies,
      redisService,
      redisValues,
    };
  };

  describe("onModuleInit", () => {
    it("should set worker concurrency to the configured value", () => {
      const { logger, processor } = createProcessor();

      Object.defineProperty(processor, "worker", {
        value: { concurrency: 0 },
        writable: true,
      });

      processor.onModuleInit();

      expect(processor.worker.concurrency).toBe(10);
      expect(logger.info).toHaveBeenCalledWith({ concurrency: 10 }, "Worker concurrency set");
    });
  });

  it("should add then remove the game in-progress marker and execute the aggregate query", async () => {
    const { cacheGameAndDependencies, fetchByGameId, logger, processor, redisService, redisValues } = createProcessor({
      initialRequestedVersions: { 42: 1 },
    });
    const game = createGameDto();

    fetchByGameId.mockResolvedValueOnce(game);
    cacheGameAndDependencies.mockResolvedValueOnce(undefined);

    await processor.process(createJob(42));

    expect(redisService.sadd).toHaveBeenCalledWith(GAME_BUILD_IN_PROGRESS_SET_KEY, 42);
    expect(fetchByGameId).toHaveBeenCalledWith(42);
    expect(cacheGameAndDependencies).toHaveBeenCalledWith(game);
    expect(redisValues.get(buildGameBuildAttemptedVersionKey(42))).toBe(1);
    expect(redisService.srem).toHaveBeenCalledWith(GAME_BUILD_IN_PROGRESS_SET_KEY, 42);
    expect(logger.info).toHaveBeenCalledWith({ gameId: 42 }, "Processing build job");
  });

  it("should rerun the build when a newer requested version arrives mid-flight", async () => {
    const requestedVersionKey = buildGameBuildRequestedVersionKey(42);
    const attemptedVersionKey = buildGameBuildAttemptedVersionKey(42);
    const { cacheGameAndDependencies, fetchByGameId, logger, processor, redisValues } = createProcessor({
      initialRequestedVersions: { 42: 1 },
    });
    const game = createGameDto();

    fetchByGameId.mockResolvedValue(game);
    cacheGameAndDependencies.mockImplementationOnce(async () => {
      redisValues.set(requestedVersionKey, 2);
    });
    cacheGameAndDependencies.mockResolvedValueOnce(undefined);

    await processor.process(createJob(42));

    expect(fetchByGameId).toHaveBeenCalledTimes(2);
    expect(cacheGameAndDependencies).toHaveBeenCalledTimes(2);
    expect(redisValues.get(attemptedVersionKey)).toBe(2);
    expect(logger.info).toHaveBeenCalledWith(
      { gameId: 42, latestRequestedVersion: 2, requestedVersion: 1 },
      "Detected newer requested build version, continuing current job",
    );
  });

  it("should warn and skip when the game does not exist in Postgres", async () => {
    const { cacheGameAndDependencies, fetchByGameId, logger, processor, purgeGameAndDependencies } = createProcessor({
      initialRequestedVersions: { 404: 1 },
    });

    fetchByGameId.mockResolvedValueOnce(null);
    purgeGameAndDependencies.mockResolvedValueOnce(undefined);

    await expect(processor.process(createJob(404))).resolves.toBeUndefined();
    expect(cacheGameAndDependencies).not.toHaveBeenCalled();
    expect(purgeGameAndDependencies).toHaveBeenCalledWith(404);
    expect(logger.warn).toHaveBeenCalledWith(
      { gameId: 404, requestedVersion: 1 },
      "Game not found in database, purged cached game payload",
    );
  });

  it("should still complete when removing in-progress marker fails", async () => {
    const queryError = new Error("query failed");
    const cleanupError = new Error("cleanup failed");
    const { fetchByGameId, logger, processor, redisService } = createProcessor({
      initialRequestedVersions: { 42: 1 },
    });

    fetchByGameId.mockRejectedValueOnce(queryError);
    vi.mocked(redisService.srem).mockRejectedValueOnce(cleanupError);

    await expect(processor.process(createJob(42))).rejects.toThrow("query failed");
    expect(logger.error).toHaveBeenCalledWith(
      { err: cleanupError, gameId: 42 },
      "Failed to remove game from in-progress set",
    );
  });

  it("should not queue a replacement job on completion when the latest request was already attempted", async () => {
    const { add, logger, processor } = createProcessor({
      initialAttemptedVersions: { 7: 1 },
      initialRequestedVersions: { 7: 1 },
    });

    await processor.onCompleted(createJob(7));

    expect(add).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith({ gameId: 7 }, "Successfully completed build job");
  });

  it("should queue a fresh build after completion when a newer request exists", async () => {
    const { add, logger, processor } = createProcessor({
      initialAttemptedVersions: { 7: 1 },
      initialRequestedVersions: { 7: 2 },
    });

    await processor.onCompleted(createJob(7));

    expect(add).toHaveBeenCalledWith(GAME_BUILD_JOB_NAME, { gameId: 7 }, buildGameBuildJobOptions(7));
    expect(logger.warn).toHaveBeenCalledWith(
      { attemptedVersion: 1, gameId: 7, outcome: "completed", requestedVersion: 2 },
      "Queued fresh build job for newer requested version",
    );
  });

  it("should not queue a replacement job after failure when the latest request was already attempted", async () => {
    const { add, logger, processor } = createProcessor({
      initialAttemptedVersions: { 15: 3 },
      initialRequestedVersions: { 15: 3 },
    });
    const error = new Error("build failed");

    await processor.onFailed(createJob(15), error);

    expect(add).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith({ err: error, gameId: 15 }, "Failed to build game");
  });

  it("should queue a fresh build after failure when a newer request exists", async () => {
    const { add, logger, processor } = createProcessor({
      initialAttemptedVersions: { 15: 3 },
      initialRequestedVersions: { 15: 4 },
    });
    const error = new Error("build failed");

    await processor.onFailed(createJob(15), error);

    expect(add).toHaveBeenCalledWith(GAME_BUILD_JOB_NAME, { gameId: 15 }, buildGameBuildJobOptions(15));
    expect(logger.warn).toHaveBeenCalledWith(
      { attemptedVersion: 3, gameId: 15, outcome: "failed", requestedVersion: 4 },
      "Queued fresh build job for newer requested version",
    );
  });
});
