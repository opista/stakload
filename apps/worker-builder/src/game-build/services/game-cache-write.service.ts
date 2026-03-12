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

    const franchiseItems = [...(game.franchise ? [game.franchise] : []), ...game.franchises];

    const simpleReferenceFields: { prefix: string; items: { id: number }[] }[] = [
      { items: game.genres, prefix: "genre" },
      { items: game.platforms, prefix: "platform" },
      { items: game.themes, prefix: "theme" },
      { items: game.gameModes, prefix: "gameMode" },
      { items: game.keywords, prefix: "keyword" },
      { items: game.playerPerspectives, prefix: "playerPerspective" },
      { items: game.alternativeNames, prefix: "alternativeName" },
      { items: game.bundles, prefix: "bundleGame" },
      { items: game.collections, prefix: "collection" },
      { items: game.externalGames, prefix: "externalGame" },
      { items: franchiseItems, prefix: "franchise" },
      { items: game.gameEngines, prefix: "gameEngine" },
      { items: game.ageRatings, prefix: "ageRating" },
      { items: game.languageSupports, prefix: "languageSupport" },
      { items: game.multiplayerModes, prefix: "multiplayerMode" },
      { items: game.involvedCompanies, prefix: "involvedCompany" },
      { items: game.similarGames, prefix: "similarGame" },
      { items: game.websites, prefix: "website" },
      { items: game.parentGame ? [game.parentGame] : [], prefix: "parentGame" },
      { items: game.versionParent ? [game.versionParent] : [], prefix: "versionParent" },
      { items: game.gameStatus ? [game.gameStatus] : [], prefix: "gameStatus" },
      { items: game.gameType ? [game.gameType] : [], prefix: "gameType" },
    ];

    for (const { items, prefix } of simpleReferenceFields) {
      this.addReferenceItemDependencies(multi, prefix, items, game.id);
    }

    this.addReferenceItemDependencies(multi, "company", [...game.developers, ...game.publishers], game.id);

    // Nested externalGame sub-dependencies
    this.addReferenceItemDependencies(
      multi,
      "externalGameSource",
      game.externalGames.filter((eg) => eg.externalGameSource != null).map((eg) => ({ id: eg.externalGameSource! })),
      game.id,
    );
    this.addReferenceItemDependencies(
      multi,
      "gameReleaseFormat",
      game.externalGames.filter((eg) => eg.gameReleaseFormat != null).map((eg) => ({ id: eg.gameReleaseFormat! })),
      game.id,
    );
    this.addReferenceItemDependencies(
      multi,
      "platform",
      game.externalGames.filter((eg) => eg.platform != null).map((eg) => ({ id: eg.platform! })),
      game.id,
    );

    // Nested languageSupport sub-dependencies
    this.addReferenceItemDependencies(
      multi,
      "language",
      game.languageSupports.filter((ls) => ls.language != null).map((ls) => ({ id: ls.language! })),
      game.id,
    );
    this.addReferenceItemDependencies(
      multi,
      "languageSupportType",
      game.languageSupports.filter((ls) => ls.languageSupportType != null).map((ls) => ({ id: ls.languageSupportType! })),
      game.id,
    );

    // Nested website sub-dependencies
    this.addReferenceItemDependencies(
      multi,
      "websiteType",
      game.websites.filter((w) => w.websiteType != null).map((w) => w.websiteType!),
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
