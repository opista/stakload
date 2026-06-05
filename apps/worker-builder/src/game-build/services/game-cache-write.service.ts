import { Injectable } from "@nestjs/common";

import {
  cacheGameAndDependencies as cacheGameAndDependenciesPayload,
  purgeGameAndDependencies as purgeGameAndDependenciesPayload,
  type GameDto,
  type GameCacheRedisClient,
} from "@stakload/game-cache-contracts";
import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

@Injectable()
export class GameCacheWriteService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly redisService: RedisService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async cacheGameAndDependencies(game: GameDto): Promise<void> {
    try {
      await cacheGameAndDependenciesPayload(this.redisService.client as GameCacheRedisClient, game);
    } catch (error) {
      this.logger.error({ err: error, gameId: game.id }, "Failed to cache game cache payload");
      throw error;
    }
  }

  async purgeGameAndDependencies(gameId: number): Promise<void> {
    try {
      await purgeGameAndDependenciesPayload(this.redisService.client as GameCacheRedisClient, gameId);
    } catch (error) {
      this.logger.error({ err: error, gameId }, "Failed to purge game cache payload");
      throw error;
    }
  }
}
