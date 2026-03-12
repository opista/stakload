import { Injectable } from "@nestjs/common";

import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import type { GameDto } from "../../models/dto/game.dto";

type RedisMultiResult = [Error | null, unknown];
type RedisDependencyPipeline = {
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

  private addReferenceItemDependencies(
    multi: RedisDependencyPipeline,
    prefix: string,
    items: { id: number }[],
    gameId: number,
  ): void {
    const uniqueIds = new Set(items.map((item) => item.id));

    for (const id of uniqueIds) {
      multi.sadd(`${prefix}:${id}:games`, gameId);
    }
  }

  async cacheGameAndDependencies(game: GameDto): Promise<void> {
    const multi = this.redisService.client.multi();

    multi.set(`game:${game.id}`, JSON.stringify(game));

    const simpleReferenceFields: { prefix: string; items: { id: number }[] }[] = [
      { prefix: "genre", items: game.genres },
      { prefix: "platform", items: game.platforms },
      { prefix: "theme", items: game.themes },
      { prefix: "gameMode", items: game.gameModes },
      { prefix: "keyword", items: game.keywords },
      { prefix: "playerPerspective", items: game.playerPerspectives },
    ];

    for (const { prefix, items } of simpleReferenceFields) {
      this.addReferenceItemDependencies(multi, prefix, items, game.id);
    }

    this.addReferenceItemDependencies(
      multi,
      "company",
      game.involvedCompanies.map((ic) => ic.company),
      game.id,
    );

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
