import type { Queue } from "bullmq";

import {
  buildGameBuildJobOptions,
  buildGameBuildRequestedVersionKey,
  buildGameDependencySetKey,
  GAME_BUILD_JOB_NAME,
  GAME_RESOURCE_DEPENDENT_REFERENCE_KINDS,
  type GameBuildJobPayload,
} from "@stakload/game-cache-contracts";
import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import { WebhookGameBuildOrchestratorService } from "./webhook-game-build-orchestrator.service";

describe("WebhookGameBuildOrchestratorService", () => {
  const createService = ({
    gameIdsByReferenceKey = {},
  }: {
    gameIdsByReferenceKey?: Record<string, string[]>;
  } = {}) => {
    const redisValues = new Map<string, number>();
    const addBulk = vi.fn().mockResolvedValue([]);
    const pipeline = {
      exec: vi.fn().mockResolvedValue([]),
      incr: vi.fn().mockImplementation((key: string) => {
        const nextVersion = (redisValues.get(key) ?? 0) + 1;
        redisValues.set(key, nextVersion);
        return pipeline;
      }),
    };
    const multi = vi.fn().mockReturnValue(pipeline);
    const incr = vi.fn().mockImplementation(async (key: string) => {
      const nextVersion = (redisValues.get(key) ?? 0) + 1;
      redisValues.set(key, nextVersion);
      return nextVersion;
    });
    const smembers = vi.fn().mockImplementation((key: string) => Promise.resolve(gameIdsByReferenceKey[key] ?? []));
    const logger = {
      debug: vi.fn(),
      info: vi.fn(),
      setContext: vi.fn(),
      warn: vi.fn(),
    } as unknown as PinoLogger;
    const gameBuildQueue = {
      addBulk,
    } as unknown as Queue<GameBuildJobPayload, void, string>;
    const redisService = {
      client: {
        incr,
        multi,
        smembers,
      },
    } as unknown as RedisService;

    return {
      addBulk,
      incr,
      multi,
      pipeline,
      redisValues,
      service: new WebhookGameBuildOrchestratorService(gameBuildQueue, logger, redisService),
      smembers,
    };
  };

  it("queues rebuilds for games webhooks and increments requested rebuild versions", async () => {
    const payloadId = 42;
    const parentKey = buildGameDependencySetKey("parentGame", payloadId);
    const similarKey = buildGameDependencySetKey("similarGame", payloadId);
    const { addBulk, incr, multi, pipeline, redisValues, service, smembers } = createService({
      gameIdsByReferenceKey: {
        [parentKey]: ["100", "101"],
        [similarKey]: ["101", "102"],
      },
    });

    await expect(
      service.enqueueGameBuilds({
        action: "update",
        outcome: "handled",
        payload: { id: payloadId },
        resource: "games",
      }),
    ).resolves.toBeUndefined();

    for (const referenceKind of GAME_RESOURCE_DEPENDENT_REFERENCE_KINDS) {
      expect(smembers).toHaveBeenCalledWith(buildGameDependencySetKey(referenceKind, payloadId));
    }

    for (const gameId of [42, 100, 101, 102]) {
      expect(pipeline.incr).toHaveBeenCalledWith(buildGameBuildRequestedVersionKey(gameId));
      expect(redisValues.get(buildGameBuildRequestedVersionKey(gameId))).toBe(1);
    }
    expect(multi).toHaveBeenCalledTimes(1);
    expect(pipeline.exec).toHaveBeenCalledTimes(1);
    expect(incr).not.toHaveBeenCalled();

    expect(addBulk).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          data: { gameId: 42 },
          name: GAME_BUILD_JOB_NAME,
          opts: expect.objectContaining(buildGameBuildJobOptions(42)),
        }),
        expect.objectContaining({
          data: { gameId: 100 },
          opts: expect.objectContaining(buildGameBuildJobOptions(100)),
        }),
        expect.objectContaining({
          data: { gameId: 102 },
          opts: expect.objectContaining(buildGameBuildJobOptions(102)),
        }),
      ]),
    );
  });

  it("increments requested build versions on repeated webhook deliveries", async () => {
    const payloadId = 7;
    const platformKey = buildGameDependencySetKey("platform", payloadId);
    const { redisValues, service } = createService({
      gameIdsByReferenceKey: {
        [platformKey]: ["22", "23"],
      },
    });

    await service.enqueueGameBuilds({
      action: "delete",
      outcome: "handled",
      payload: { id: payloadId },
      resource: "platforms",
    });
    await service.enqueueGameBuilds({
      action: "update",
      outcome: "handled",
      payload: { id: payloadId },
      resource: "platforms",
    });

    expect(redisValues.get(buildGameBuildRequestedVersionKey(22))).toBe(2);
    expect(redisValues.get(buildGameBuildRequestedVersionKey(23))).toBe(2);
  });

  it("retries queue add failures without incrementing requested versions again", async () => {
    const payloadId = 7;
    const genreKey = buildGameDependencySetKey("genre", payloadId);
    const { addBulk, incr, pipeline, redisValues, service } = createService({
      gameIdsByReferenceKey: {
        [genreKey]: ["22"],
      },
    });

    addBulk.mockRejectedValueOnce(new Error("queue unavailable"));
    addBulk.mockResolvedValueOnce([]);

    await expect(
      service.enqueueGameBuilds({
        action: "update",
        outcome: "handled",
        payload: { id: payloadId },
        resource: "genres",
      }),
    ).resolves.toBeUndefined();

    expect(pipeline.incr).toHaveBeenCalledTimes(1);
    expect(incr).not.toHaveBeenCalled();
    expect(redisValues.get(buildGameBuildRequestedVersionKey(22))).toBe(1);
    expect(addBulk).toHaveBeenCalledTimes(2);
    expect(addBulk).toHaveBeenLastCalledWith([
      {
        data: { gameId: 22 },
        name: GAME_BUILD_JOB_NAME,
        opts: buildGameBuildJobOptions(22),
      },
    ]);
  });

  it("queues rebuilds for stale-rejected cache-affecting webhook outcomes", async () => {
    const payloadId = 7;
    const genreKey = buildGameDependencySetKey("genre", payloadId);
    const { addBulk, incr, pipeline, redisValues, service } = createService({
      gameIdsByReferenceKey: {
        [genreKey]: ["22"],
      },
    });

    await expect(
      service.enqueueGameBuilds({
        action: "update",
        outcome: "rejected_stale",
        payload: { id: payloadId },
        resource: "genres",
      }),
    ).resolves.toBeUndefined();

    expect(pipeline.incr).toHaveBeenCalledWith(buildGameBuildRequestedVersionKey(22));
    expect(incr).not.toHaveBeenCalled();
    expect(redisValues.get(buildGameBuildRequestedVersionKey(22))).toBe(1);
    expect(addBulk).toHaveBeenCalledWith([
      {
        data: { gameId: 22 },
        name: GAME_BUILD_JOB_NAME,
        opts: buildGameBuildJobOptions(22),
      },
    ]);
  });

  it("ignores malformed dependency set members when resolving affected games", async () => {
    const payloadId = 7;
    const genreKey = buildGameDependencySetKey("genre", payloadId);
    const { addBulk, incr, pipeline, service } = createService({
      gameIdsByReferenceKey: {
        [genreKey]: ["22", "22abc", "0", "-1", "3.14", "", "0043"],
      },
    });

    await expect(
      service.enqueueGameBuilds({
        action: "update",
        outcome: "handled",
        payload: { id: payloadId },
        resource: "genres",
      }),
    ).resolves.toBeUndefined();

    expect(pipeline.incr).toHaveBeenCalledTimes(2);
    expect(pipeline.incr).toHaveBeenCalledWith(buildGameBuildRequestedVersionKey(22));
    expect(pipeline.incr).toHaveBeenCalledWith(buildGameBuildRequestedVersionKey(43));
    expect(incr).not.toHaveBeenCalled();
    expect(addBulk).toHaveBeenCalledWith([
      {
        data: { gameId: 22 },
        name: GAME_BUILD_JOB_NAME,
        opts: buildGameBuildJobOptions(22),
      },
      {
        data: { gameId: 43 },
        name: GAME_BUILD_JOB_NAME,
        opts: buildGameBuildJobOptions(43),
      },
    ]);
  });

  it("does not queue jobs for ignored webhook outcomes", async () => {
    const { addBulk, incr, service } = createService();

    await expect(
      service.enqueueGameBuilds({
        action: "update",
        outcome: "ignored_unsupported",
        payload: { id: 42 },
        resource: "platforms",
      }),
    ).resolves.toBeUndefined();

    expect(incr).not.toHaveBeenCalled();
    expect(addBulk).not.toHaveBeenCalled();
  });

  it("does not queue jobs for handled resources that are not cache-affecting", async () => {
    const { addBulk, incr, service, smembers } = createService();

    await expect(
      service.enqueueGameBuilds({
        action: "update",
        outcome: "handled",
        payload: { id: 42 },
        resource: "company_logos",
      }),
    ).resolves.toBeUndefined();

    expect(smembers).not.toHaveBeenCalled();
    expect(incr).not.toHaveBeenCalled();
    expect(addBulk).not.toHaveBeenCalled();
  });

  it("throws the expected validation error for a null webhook payload", async () => {
    const { addBulk, incr, service } = createService();

    await expect(
      service.enqueueGameBuilds({
        action: "update",
        outcome: "handled",
        payload: null,
        resource: "games",
      } as never),
    ).rejects.toThrow("Webhook payload must include an integer id before enqueueing game rebuilds");

    expect(incr).not.toHaveBeenCalled();
    expect(addBulk).not.toHaveBeenCalled();
  });
});
