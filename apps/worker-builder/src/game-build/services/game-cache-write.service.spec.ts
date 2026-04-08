import { TestBed } from "@suites/unit";
import type { Mocked } from "vitest";

import { buildGameDependencyIndexKey } from "@stakload/game-cache-contracts";
import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import type { GameDto } from "../../models/dto/game.dto";
import { GameCacheWriteService } from "./game-cache-write.service";

describe("GameCacheWriteService", () => {
  let logger: Mocked<PinoLogger>;
  let redisService: Mocked<RedisService>;
  let service: GameCacheWriteService;

  const createGame = (): GameDto => ({
    ageRatings: [
      {
        categoryId: 901,
        contentDescriptionIds: [902],
        descriptions: [],
        id: 900,
        name: "18+",
        organisation: "PEGI",
        organisationId: 903,
      },
    ],
    aggregatedRating: null,
    aggregatedRatingCount: null,
    alternativeNames: [
      {
        checksum: null,
        comment: null,
        createdAt: null,
        game: 42,
        id: 101,
        name: "Alt Name",
        sourceUpdatedAt: null,
        updatedAt: null,
      },
    ],
    artworks: [{ animated: false, height: 200, id: 104, imageId: "art-1", width: 320 }],
    bundles: [{ id: 200, name: "Bundle Game", slug: null, url: null }],
    checksum: null,
    collections: [
      {
        checksum: null,
        createdAt: null,
        description: null,
        games: null,
        id: 301,
        name: "Collection",
        slug: null,
        sourceUpdatedAt: null,
        updatedAt: null,
        url: null,
      },
    ],
    cover: { animated: false, height: 300, id: 102, imageId: "cover-1", width: 200 },
    createdAt: "2026-01-01T00:00:00.000Z",
    developers: [
      { id: 10, name: "Dev Studio" },
      { id: 11, name: "Co Dev Studio" },
    ],
    externalGames: [
      {
        checksum: null,
        countries: null,
        createdAt: null,
        externalGameSource: 500,
        externalGameSourceDetails: null,
        game: 42,
        gameReleaseFormat: 600,
        gameReleaseFormatDetails: null,
        id: 401,
        name: null,
        platform: 7,
        platformDetails: null,
        sourceUpdatedAt: null,
        uid: null,
        updatedAt: null,
        url: null,
        year: null,
      },
    ],
    firstReleaseDate: 1_704_067_200,
    franchise: { id: 700, name: "Main Franchise", slug: null, url: null },
    franchises: [{ id: 701, name: "Sub Franchise", slug: null, url: null }],
    gameEngines: [{ checksum: null, companies: null, createdAt: null, description: null, id: 800, logo: null, name: "Engine", slug: null, sourceUpdatedAt: null, updatedAt: null, url: null }],
    gameModes: [],
    gameStatus: { id: 1, name: "Released" },
    gameType: { id: 0, name: "Main game" },
    genres: [
      { id: 3, name: "Adventure" },
      { id: 3, name: "Adventure" },
      { id: 5, name: "Shooter" },
    ],
    id: 42,
    involvedCompanies: [
      { company: { id: 10, name: "Dev Studio" }, developer: true, id: 1400, porting: false, publisher: false, supporting: false },
    ],
    keywords: [],
    languageSupports: [
      {
        checksum: null,
        createdAt: null,
        game: 42,
        id: 1000,
        language: 1100,
        languageDetails: null,
        languageSupportType: 1200,
        languageSupportTypeDetails: null,
        sourceUpdatedAt: null,
        updatedAt: null,
      },
    ],
    multiplayerModes: [
      {
        campaignCoop: null,
        checksum: null,
        createdAt: null,
        dropIn: null,
        game: 42,
        id: 1300,
        lanCoop: null,
        offlineCoop: null,
        offlineCoopMax: null,
        offlineMax: null,
        onlineCoop: null,
        onlineCoopMax: null,
        onlineMax: null,
        platform: null,
        sourceUpdatedAt: null,
        splitScreen: null,
        splitScreenOnline: null,
        updatedAt: null,
      },
    ],
    name: "Example Game",
    parentGame: { id: 1800, name: "Parent Game", slug: null, url: null },
    platforms: [{ id: 6, name: "PC" }],
    playerPerspectives: [],
    publishers: [
      { id: 10, name: "Dev Studio" },
      { id: 12, name: "Publishing House" },
    ],
    rating: 77.4,
    ratingCount: null,
    screenshots: [{ animated: false, height: 180, id: 103, imageId: "screenshot-1", width: 320 }],
    similarGames: [{ id: 1500, name: "Similar Game", slug: null, url: null }],
    slug: null,
    sourceUpdatedAt: null,
    storyline: null,
    summary: "Example summary",
    themes: [{ id: 18, name: "Sci-fi" }],
    totalRating: null,
    totalRatingCount: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    url: null,
    versionParent: { id: 1900, name: "Version Parent", slug: null, url: null },
    versionTitle: null,
    videos: [{ id: 105, name: "Trailer", videoId: "video-id-1" }],
    websites: [{ id: 1600, trusted: true, url: "https://example.com", websiteType: { id: 1700, name: "Official" } }],
  });

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(GameCacheWriteService).compile();

    service = unit;
    logger = unitRef.get(PinoLogger) as unknown as Mocked<PinoLogger>;
    redisService = unitRef.get(RedisService) as unknown as Mocked<RedisService>;
  });

  it("should replace stale memberships and write current dependencies in one Redis transaction", async () => {
    const game = createGame();
    const staleDependencyKey = "genre:999:games";
    const dependencyIndexKey = buildGameDependencyIndexKey(game.id);
    const multi = {
      del: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
      sadd: vi.fn().mockReturnThis(),
      srem: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    };
    const client = {
      multi: vi.fn().mockReturnValue(multi),
      smembers: vi.fn().mockResolvedValue([staleDependencyKey]),
    };

    Object.defineProperty(redisService, "client", {
      configurable: true,
      value: client,
    });

    await expect(service.cacheGameAndDependencies(game)).resolves.toBeUndefined();

    expect(client.multi).toHaveBeenCalledTimes(1);
    expect(client.smembers).toHaveBeenCalledWith(dependencyIndexKey);
    expect(multi.set).toHaveBeenCalledWith("game:42", JSON.stringify(game));
    expect(multi.srem).toHaveBeenCalledWith(staleDependencyKey, 42);
    expect(multi.del).toHaveBeenCalledWith(dependencyIndexKey);
    expect(multi.exec).toHaveBeenCalledTimes(1);

    // genres (deduped id:3)
    expect(multi.sadd).toHaveBeenCalledWith("genre:3:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("genre:5:games", 42);

    // platforms
    expect(multi.sadd).toHaveBeenCalledWith("platform:6:games", 42);

    // themes
    expect(multi.sadd).toHaveBeenCalledWith("theme:18:games", 42);

    // companies (developers + publishers, deduped id:10)
    expect(multi.sadd).toHaveBeenCalledWith("company:10:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("company:11:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("company:12:games", 42);

    // alternativeNames
    expect(multi.sadd).toHaveBeenCalledWith("alternativeName:101:games", 42);

    // bundles
    expect(multi.sadd).toHaveBeenCalledWith("bundleGame:200:games", 42);

    // collections
    expect(multi.sadd).toHaveBeenCalledWith("collection:301:games", 42);

    // externalGames
    expect(multi.sadd).toHaveBeenCalledWith("externalGame:401:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("externalGameSource:500:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("gameReleaseFormat:600:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("platform:7:games", 42);

    // franchise (single) and franchises (array)
    expect(multi.sadd).toHaveBeenCalledWith("franchise:700:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("franchise:701:games", 42);

    // gameEngines
    expect(multi.sadd).toHaveBeenCalledWith("gameEngine:800:games", 42);

    // ageRatings
    expect(multi.sadd).toHaveBeenCalledWith("ageRating:900:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("ageRatingCategory:901:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("ageRatingContentDescription:902:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("ageRatingOrganisation:903:games", 42);

    // languageSupports
    expect(multi.sadd).toHaveBeenCalledWith("languageSupport:1000:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("language:1100:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("languageSupportType:1200:games", 42);

    // multiplayerModes
    expect(multi.sadd).toHaveBeenCalledWith("multiplayerMode:1300:games", 42);

    // involvedCompanies
    expect(multi.sadd).toHaveBeenCalledWith("involvedCompany:1400:games", 42);

    // similarGames
    expect(multi.sadd).toHaveBeenCalledWith("similarGame:1500:games", 42);

    // websites
    expect(multi.sadd).toHaveBeenCalledWith("website:1600:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("websiteType:1700:games", 42);

    // assets and videos
    expect(multi.sadd).toHaveBeenCalledWith("artwork:104:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("cover:102:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("screenshot:103:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("gameVideo:105:games", 42);

    // parentGame
    expect(multi.sadd).toHaveBeenCalledWith("parentGame:1800:games", 42);

    // versionParent
    expect(multi.sadd).toHaveBeenCalledWith("versionParent:1900:games", 42);

    // gameStatus
    expect(multi.sadd).toHaveBeenCalledWith("gameStatus:1:games", 42);

    // gameType
    expect(multi.sadd).toHaveBeenCalledWith("gameType:0:games", 42);

    // reverse dependency index
    const dependencyIndexWrite = multi.sadd.mock.calls.find(([key]) => key === dependencyIndexKey);
    expect(dependencyIndexWrite).toBeDefined();
    expect(dependencyIndexWrite).toEqual(
      expect.arrayContaining([dependencyIndexKey, "genre:3:games", "cover:102:games", "gameVideo:105:games"]),
    );
  });

  it("should throw when Redis returns no transaction results", async () => {
    const multi = {
      del: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue(null),
      sadd: vi.fn().mockReturnThis(),
      srem: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    };
    const client = {
      multi: vi.fn().mockReturnValue(multi),
      smembers: vi.fn().mockResolvedValue([]),
    };

    Object.defineProperty(redisService, "client", {
      configurable: true,
      value: client,
    });

    await expect(service.cacheGameAndDependencies(createGame())).rejects.toThrow(
      "Redis transaction did not return any results",
    );
  });

  it("should log and throw when any command in the transaction fails", async () => {
    const writeError = new Error("set failed");
    const multi = {
      del: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([[writeError, null]]),
      sadd: vi.fn().mockReturnThis(),
      srem: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    };
    const client = {
      multi: vi.fn().mockReturnValue(multi),
      smembers: vi.fn().mockResolvedValue([]),
    };

    Object.defineProperty(redisService, "client", {
      configurable: true,
      value: client,
    });

    await expect(service.cacheGameAndDependencies(createGame())).rejects.toThrow("set failed");
    expect(logger.error).toHaveBeenCalledWith({ err: writeError, gameId: 42 }, "Failed to cache game build payload");
  });

  it("should purge cached payload and remove all dependency memberships", async () => {
    const gameId = 42;
    const dependencyIndexKey = buildGameDependencyIndexKey(gameId);
    const multi = {
      del: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
      sadd: vi.fn().mockReturnThis(),
      srem: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    };
    const client = {
      multi: vi.fn().mockReturnValue(multi),
      smembers: vi.fn().mockResolvedValue(["genre:3:games", "platform:6:games"]),
    };

    Object.defineProperty(redisService, "client", {
      configurable: true,
      value: client,
    });

    await expect(service.purgeGameAndDependencies(gameId)).resolves.toBeUndefined();

    expect(client.smembers).toHaveBeenCalledWith(dependencyIndexKey);
    expect(multi.del).toHaveBeenCalledWith("game:42");
    expect(multi.srem).toHaveBeenCalledWith("genre:3:games", 42);
    expect(multi.srem).toHaveBeenCalledWith("platform:6:games", 42);
    expect(multi.del).toHaveBeenCalledWith(dependencyIndexKey);
    expect(multi.exec).toHaveBeenCalledTimes(1);
  });
});
