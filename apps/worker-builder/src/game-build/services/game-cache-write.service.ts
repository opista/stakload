import { Injectable } from "@nestjs/common";

import {
  buildGameCacheKey,
  buildGameDependencyIndexKey,
  buildGameDependencySetKey,
  type GameCacheReferenceKind,
} from "@stakload/game-cache-contracts";
import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import type { GameDto } from "../../models/dto/game.dto";

type RedisMultiResult = [Error | null, unknown];
type RedisDependencyPipeline = {
  del: (...keys: string[]) => unknown;
  exec: () => Promise<unknown>;
  sadd: (key: string, ...members: Array<number | string>) => unknown;
  set: (key: string, value: string) => unknown;
  srem: (key: string, ...members: Array<number | string>) => unknown;
};

@Injectable()
export class GameCacheWriteService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly redisService: RedisService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private addDependencyKeysFromIds(
    dependencyKeys: Set<string>,
    referenceKind: GameCacheReferenceKind,
    ids: Array<number | null | undefined> | null | undefined,
  ): void {
    if (!ids) {
      return;
    }

    for (const id of ids) {
      if (typeof id !== "number") {
        continue;
      }

      dependencyKeys.add(buildGameDependencySetKey(referenceKind, id));
    }
  }

  private addDependencyKeysFromItems(
    dependencyKeys: Set<string>,
    referenceKind: GameCacheReferenceKind,
    items: Array<{ id: number } | null | undefined> | null | undefined,
  ): void {
    if (!items) {
      return;
    }

    for (const item of items) {
      if (typeof item?.id !== "number") {
        continue;
      }

      dependencyKeys.add(buildGameDependencySetKey(referenceKind, item.id));
    }
  }

  private buildDependencyKeys(game: GameDto): string[] {
    const dependencyKeys = new Set<string>();
    const ageRatings = game.ageRatings ?? [];
    const externalGames = game.externalGames ?? [];
    const involvedCompanies = game.involvedCompanies ?? [];
    const languageSupports = game.languageSupports ?? [];
    const websites = game.websites ?? [];
    const franchiseItems = [...(game.franchise ? [game.franchise] : []), ...(game.franchises ?? [])];

    const referenceFields: Array<{
      items: Array<{ id: number } | null | undefined>;
      referenceKind: GameCacheReferenceKind;
    }> = [
      { items: game.genres, referenceKind: "genre" },
      { items: game.platforms, referenceKind: "platform" },
      { items: game.themes, referenceKind: "theme" },
      { items: game.gameModes, referenceKind: "gameMode" },
      { items: game.keywords, referenceKind: "keyword" },
      { items: game.playerPerspectives, referenceKind: "playerPerspective" },
      { items: game.alternativeNames, referenceKind: "alternativeName" },
      { items: game.artworks, referenceKind: "artwork" },
      { items: game.bundles, referenceKind: "bundleGame" },
      { items: game.collections, referenceKind: "collection" },
      { items: game.externalGames, referenceKind: "externalGame" },
      { items: franchiseItems, referenceKind: "franchise" },
      { items: game.gameEngines, referenceKind: "gameEngine" },
      { items: ageRatings, referenceKind: "ageRating" },
      { items: languageSupports, referenceKind: "languageSupport" },
      { items: game.multiplayerModes, referenceKind: "multiplayerMode" },
      { items: involvedCompanies, referenceKind: "involvedCompany" },
      { items: game.screenshots, referenceKind: "screenshot" },
      { items: game.similarGames, referenceKind: "similarGame" },
      { items: game.videos, referenceKind: "gameVideo" },
      { items: game.websites, referenceKind: "website" },
      { items: game.parentGame ? [game.parentGame] : [], referenceKind: "parentGame" },
      { items: game.versionParent ? [game.versionParent] : [], referenceKind: "versionParent" },
      { items: game.gameStatus ? [game.gameStatus] : [], referenceKind: "gameStatus" },
      { items: game.gameType ? [game.gameType] : [], referenceKind: "gameType" },
      { items: game.cover ? [game.cover] : [], referenceKind: "cover" },
    ];

    for (const { items, referenceKind } of referenceFields) {
      this.addDependencyKeysFromItems(dependencyKeys, referenceKind, items);
    }

    this.addDependencyKeysFromItems(dependencyKeys, "company", [
      ...(game.developers ?? []),
      ...(game.publishers ?? []),
      ...involvedCompanies.map((involvedCompany) => involvedCompany.company),
    ]);

    this.addDependencyKeysFromIds(
      dependencyKeys,
      "ageRatingCategory",
      ageRatings.map((ageRating) => ageRating.categoryId),
    );
    this.addDependencyKeysFromIds(
      dependencyKeys,
      "ageRatingOrganisation",
      ageRatings.map((ageRating) => ageRating.organisationId),
    );
    this.addDependencyKeysFromIds(
      dependencyKeys,
      "ageRatingContentDescription",
      ageRatings.flatMap((ageRating) => ageRating.contentDescriptionIds),
    );

    this.addDependencyKeysFromIds(
      dependencyKeys,
      "externalGameSource",
      externalGames.map((externalGame) => externalGame.externalGameSource),
    );
    this.addDependencyKeysFromIds(
      dependencyKeys,
      "gameReleaseFormat",
      externalGames.map((externalGame) => externalGame.gameReleaseFormat),
    );
    this.addDependencyKeysFromIds(
      dependencyKeys,
      "platform",
      externalGames.map((externalGame) => externalGame.platform),
    );

    this.addDependencyKeysFromIds(
      dependencyKeys,
      "language",
      languageSupports.map((languageSupport) => languageSupport.language),
    );
    this.addDependencyKeysFromIds(
      dependencyKeys,
      "languageSupportType",
      languageSupports.map((languageSupport) => languageSupport.languageSupportType),
    );

    this.addDependencyKeysFromItems(
      dependencyKeys,
      "websiteType",
      websites.filter((website) => website.websiteType != null).map((website) => website.websiteType!),
    );

    return Array.from(dependencyKeys);
  }

  private async executeDependencyTransaction(
    multi: RedisDependencyPipeline,
    gameId: number,
    operation: "cache" | "purge",
  ): Promise<void> {
    const results = await multi.exec();

    if (!results) {
      throw new Error("Redis transaction did not return any results");
    }

    for (const [error] of results as RedisMultiResult[]) {
      if (error) {
        this.logger.error({ err: error, gameId }, `Failed to ${operation} game cache payload`);
        throw error;
      }
    }
  }

  async cacheGameAndDependencies(game: GameDto): Promise<void> {
    const dependencyIndexKey = buildGameDependencyIndexKey(game.id);
    const existingDependencyKeys = await this.redisService.client.smembers(dependencyIndexKey);
    const currentDependencyKeys = this.buildDependencyKeys(game);
    const existingDependencyKeySet = new Set(existingDependencyKeys);
    const currentDependencyKeySet = new Set(currentDependencyKeys);
    const multi = this.redisService.client.multi() as unknown as RedisDependencyPipeline;

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

    await this.executeDependencyTransaction(multi, game.id, "cache");
  }

  async purgeGameAndDependencies(gameId: number): Promise<void> {
    const dependencyIndexKey = buildGameDependencyIndexKey(gameId);
    const existingDependencyKeys = await this.redisService.client.smembers(dependencyIndexKey);
    const multi = this.redisService.client.multi() as unknown as RedisDependencyPipeline;

    multi.del(buildGameCacheKey(gameId));

    for (const dependencyKey of existingDependencyKeys) {
      multi.srem(dependencyKey, gameId);
    }

    multi.del(dependencyIndexKey);

    await this.executeDependencyTransaction(multi, gameId, "purge");
  }
}
