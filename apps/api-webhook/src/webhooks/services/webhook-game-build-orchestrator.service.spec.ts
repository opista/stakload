import {
  buildGameBuildJobId,
  buildGameDependencySetKey,
  GAME_BUILD_JOB_NAME,
  GAME_RESOURCE_DEPENDENT_REFERENCE_KINDS,
  type GameBuildJobPayload,
} from "@stakload/game-cache-contracts";
import type { Queue } from "bullmq";

import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import { WebhookGameBuildOrchestratorService } from "./webhook-game-build-orchestrator.service";

describe("WebhookGameBuildOrchestratorService", () => {
  const createService = ({
    gameIdsByReferenceKey = {},
  }: {
    gameIdsByReferenceKey?: Record<string, string[]>;
  } = {}): {
    gameBuildQueue: Queue<GameBuildJobPayload, void, string>;
    logger: PinoLogger;
    redisService: RedisService;
    service: WebhookGameBuildOrchestratorService;
    smembers: ReturnType<typeof vi.fn>;
  } => {
    const addBulk = vi.fn().mockResolvedValue([]);
    const smembers = vi
      .fn()
      .mockImplementation((key: string) => Promise.resolve(gameIdsByReferenceKey[key] ?? []));
    const logger = {
      debug: vi.fn(),
      info: vi.fn(),
      setContext: vi.fn(),
    } as unknown as PinoLogger;
    const gameBuildQueue = {
      addBulk,
    } as unknown as Queue<GameBuildJobPayload, void, string>;
    const redisService = {
      client: {
        smembers,
      },
    } as unknown as RedisService;
    const service = new WebhookGameBuildOrchestratorService(gameBuildQueue, logger, redisService);

    return {
      gameBuildQueue,
      logger,
      redisService,
      service,
      smembers,
    };
  };

  it("queues rebuilds for games webhooks including dependent game references", async () => {
    const payloadId = 42;
    const parentKey = buildGameDependencySetKey("parentGame", payloadId);
    const similarKey = buildGameDependencySetKey("similarGame", payloadId);
    const { gameBuildQueue, service, smembers } = createService({
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

    expect(gameBuildQueue.addBulk).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          data: { gameId: 42 },
          name: GAME_BUILD_JOB_NAME,
          opts: expect.objectContaining({
            jobId: buildGameBuildJobId(42),
            removeOnComplete: true,
          }),
        }),
        expect.objectContaining({
          data: { gameId: 100 },
          opts: expect.objectContaining({ jobId: buildGameBuildJobId(100) }),
        }),
        expect.objectContaining({
          data: { gameId: 102 },
          opts: expect.objectContaining({ jobId: buildGameBuildJobId(102) }),
        }),
      ]),
    );
  });

  it("queues rebuilds for supported cache-affecting non-game resources", async () => {
    const payloadId = 7;
    const platformKey = buildGameDependencySetKey("platform", payloadId);
    const { gameBuildQueue, service, smembers } = createService({
      gameIdsByReferenceKey: {
        [platformKey]: ["22", "23"],
      },
    });

    await expect(
      service.enqueueGameBuilds({
        action: "delete",
        outcome: "handled",
        payload: { id: payloadId },
        resource: "platforms",
      }),
    ).resolves.toBeUndefined();

    expect(smembers).toHaveBeenCalledWith(platformKey);
    expect(gameBuildQueue.addBulk).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ data: { gameId: 22 } }),
        expect.objectContaining({ data: { gameId: 23 } }),
      ]),
    );
  });

  it("does not queue jobs for non-handled webhook outcomes", async () => {
    const { gameBuildQueue, service } = createService();

    await expect(
      service.enqueueGameBuilds({
        action: "update",
        outcome: "rejected_stale",
        payload: { id: 42 },
        resource: "platforms",
      }),
    ).resolves.toBeUndefined();

    expect(gameBuildQueue.addBulk).not.toHaveBeenCalled();
  });

  it("does not queue jobs for handled resources that are not cache-affecting", async () => {
    const { gameBuildQueue, service, smembers } = createService();

    await expect(
      service.enqueueGameBuilds({
        action: "update",
        outcome: "handled",
        payload: { id: 42 },
        resource: "company_logos",
      }),
    ).resolves.toBeUndefined();

    expect(smembers).not.toHaveBeenCalled();
    expect(gameBuildQueue.addBulk).not.toHaveBeenCalled();
  });
});
