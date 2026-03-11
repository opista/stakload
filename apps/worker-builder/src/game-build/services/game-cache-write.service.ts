import { Injectable } from "@nestjs/common";

import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import type { GameDto } from "../../models/dto/game.dto";

type RedisMultiResult = [Error | null, unknown];
type RedisGenreDependencyPipeline = {
  sadd: (key: string, member: number) => unknown;
};

@Injectable()
export class GameCacheWriteService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly redisService: RedisService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private addGenreDependencyCommands(multi: RedisGenreDependencyPipeline, game: GameDto): void {
    const uniqueGenreIds = new Set(game.genres.map((genre) => genre.id));

    for (const genreId of uniqueGenreIds) {
      multi.sadd(`genre:${genreId}:games`, game.id);
    }
  }

  async cacheGameAndGenreDependencies(game: GameDto): Promise<void> {
    const multi = this.redisService.client.multi();

    multi.set(`game:${game.id}`, JSON.stringify(game));
    this.addGenreDependencyCommands(multi, game);

    const results = await multi.exec();

    if (!results) {
      throw new Error("Redis transaction did not return any results");
    }

    for (const [error] of results as RedisMultiResult[]) {
      if (error) {
        this.logger.error({ err: error, gameId: game.id }, "Failed to cache game build payload");
        throw error;
      }
    }
  }
}
