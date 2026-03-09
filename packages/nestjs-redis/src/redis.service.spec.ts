import type { Redis } from "ioredis";
import { describe, expect, it, vi } from "vitest";

import { RedisService } from "./redis.service";

describe("RedisService", () => {
  function createRedisMock(): {
    redisClient: Redis;
    quit: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    sadd: ReturnType<typeof vi.fn>;
  } {
    const quit = vi.fn();
    const disconnect = vi.fn();
    const sadd = vi.fn();

    const redisClient = {
      disconnect,
      quit,
      sadd,
    } as unknown as Redis;

    return { disconnect, quit, redisClient, sadd };
  }

  it("quits Redis on module destroy", async () => {
    const { disconnect, quit, redisClient } = createRedisMock();
    quit.mockResolvedValueOnce("OK");
    const service = new RedisService(redisClient);

    await service.onModuleDestroy();

    expect(quit).toHaveBeenCalledTimes(1);
    expect(disconnect).not.toHaveBeenCalled();
  });

  it("disconnects when quit fails", async () => {
    const { disconnect, quit, redisClient } = createRedisMock();
    quit.mockRejectedValueOnce(new Error("quit failed"));
    const service = new RedisService(redisClient);

    await service.onModuleDestroy();

    expect(quit).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("returns 0 for sadd with no members", async () => {
    const { redisClient, sadd } = createRedisMock();
    const service = new RedisService(redisClient);

    const result = await service.sadd("my-set");

    expect(result).toBe(0);
    expect(sadd).not.toHaveBeenCalled();
  });

  it("adds members with sadd", async () => {
    const { redisClient, sadd } = createRedisMock();
    sadd.mockResolvedValueOnce(2);
    const service = new RedisService(redisClient);

    const result = await service.sadd("my-set", "one", 2);

    expect(result).toBe(2);
    expect(sadd).toHaveBeenCalledTimes(1);
    expect(sadd).toHaveBeenCalledWith("my-set", "one", 2);
  });

  it("exposes the underlying client", () => {
    const { redisClient } = createRedisMock();
    const service = new RedisService(redisClient);

    expect(service.client).toBe(redisClient);
  });
});
