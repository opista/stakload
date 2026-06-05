import { buildGameCacheKey, buildGameDependencyIndexKey } from "./cache-keys";
import { buildGameCacheDependencyKeys } from "./game-cache-dependencies";
import type { GameDto } from "./models/game.dto";

type RedisMultiResult = [Error | null, unknown];

export type GameCacheRedisClient = {
  multi: () => RedisDependencyPipeline;
  smembers: (key: string) => Promise<string[]>;
};

export type RedisDependencyPipeline = {
  del: (...keys: string[]) => unknown;
  exec: () => Promise<unknown>;
  sadd: (key: string, ...members: Array<number | string>) => unknown;
  set: (key: string, value: string) => unknown;
  srem: (key: string, ...members: Array<number | string>) => unknown;
};

const executeDependencyTransaction = async (multi: RedisDependencyPipeline): Promise<void> => {
  const results = await multi.exec();

  if (!results) {
    throw new Error("Redis transaction did not return any results");
  }

  for (const [error] of results as RedisMultiResult[]) {
    if (error) throw error;
  }
};

export const cacheGameAndDependencies = async (redisClient: GameCacheRedisClient, game: GameDto): Promise<void> => {
  const dependencyIndexKey = buildGameDependencyIndexKey(game.id);
  const existingDependencyKeys = await redisClient.smembers(dependencyIndexKey);
  const currentDependencyKeys = buildGameCacheDependencyKeys(game);
  const existingDependencyKeySet = new Set(existingDependencyKeys);
  const currentDependencyKeySet = new Set(currentDependencyKeys);
  const multi = redisClient.multi();

  multi.set(buildGameCacheKey(game.id), JSON.stringify(game));

  for (const dependencyKey of existingDependencyKeys) {
    if (!currentDependencyKeySet.has(dependencyKey)) {
      multi.srem(dependencyKey, game.id);
    }
  }

  multi.del(dependencyIndexKey);

  for (const dependencyKey of currentDependencyKeys) {
    if (!existingDependencyKeySet.has(dependencyKey)) {
      multi.sadd(dependencyKey, game.id);
    }
  }

  if (currentDependencyKeys.length > 0) {
    multi.sadd(dependencyIndexKey, ...currentDependencyKeys);
  }

  await executeDependencyTransaction(multi);
};

export const purgeGameAndDependencies = async (redisClient: GameCacheRedisClient, gameId: number): Promise<void> => {
  const dependencyIndexKey = buildGameDependencyIndexKey(gameId);
  const existingDependencyKeys = await redisClient.smembers(dependencyIndexKey);
  const multi = redisClient.multi();

  multi.del(buildGameCacheKey(gameId));

  for (const dependencyKey of existingDependencyKeys) {
    multi.srem(dependencyKey, gameId);
  }

  multi.del(dependencyIndexKey);

  await executeDependencyTransaction(multi);
};
