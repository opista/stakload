import { DataSource } from "typeorm";
import type { Mocked } from "vitest";

import { RedisService } from "@stakload/nestjs-redis";

import { GamesService } from "./games.service";

const createCachedGame = () => ({
  ageRatings: [
    {
      categoryId: 2,
      contentDescriptionIds: [55],
      descriptions: ["Violence"],
      id: 41,
      name: "Mature 17+",
      organisation: "ESRB",
      organisationId: 9,
    },
  ],
  aggregatedRating: null,
  aggregatedRatingCount: null,
  alternativeNames: [],
  artworks: [{ animated: false, height: 1080, id: 101, imageId: "art-1", width: 1920 }],
  bundles: [],
  checksum: null,
  collections: [],
  cover: { animated: false, height: 800, id: 102, imageId: "cover-1", width: 600 },
  createdAt: "2026-01-01T00:00:00.000Z",
  developers: [{ id: 10, name: "Dev Studio" }],
  externalGames: [
    {
      checksum: null,
      countries: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      externalGameSource: 1,
      externalGameSourceDetails: { id: 1, name: "Steam" },
      game: 42,
      gameReleaseFormat: null,
      gameReleaseFormatDetails: null,
      id: 501,
      name: "Dota 2",
      platform: null,
      platformDetails: null,
      sourceUpdatedAt: null,
      uid: "570",
      updatedAt: "2026-01-01T00:00:00.000Z",
      url: null,
      year: null,
    },
  ],
  firstReleaseDate: 1_704_067_200,
  franchise: null,
  franchises: [],
  gameEngines: [],
  gameModes: [{ id: 1, name: "Single player" }],
  gameStatus: null,
  gameType: null,
  genres: [{ id: 3, name: "Adventure" }],
  id: 42,
  involvedCompanies: [],
  keywords: [],
  languageSupports: [],
  multiplayerModes: [
    {
      campaignCoop: false,
      checksum: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      dropIn: false,
      game: 42,
      id: 901,
      lanCoop: false,
      offlineCoop: false,
      offlineCoopMax: null,
      offlineMax: 1,
      onlineCoop: true,
      onlineCoopMax: 5,
      onlineMax: 10,
      platform: 6,
      sourceUpdatedAt: null,
      splitScreen: false,
      splitScreenOnline: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ],
  name: "Dota 2",
  parentGame: null,
  platforms: [{ id: 6, name: "PC" }],
  playerPerspectives: [],
  publishers: [{ id: 11, name: "Publisher" }],
  rating: null,
  ratingCount: null,
  screenshots: [{ animated: false, height: 1080, id: 103, imageId: "shot-1", width: 1920 }],
  similarGames: [],
  slug: "dota-2",
  sourceUpdatedAt: null,
  storyline: "Story",
  summary: "Summary",
  themes: [],
  totalRating: null,
  totalRatingCount: null,
  updatedAt: "2026-01-01T00:00:00.000Z",
  url: "https://www.igdb.com/games/dota-2",
  versionParent: null,
  versionTitle: null,
  videos: [{ id: 200, name: "Trailer", videoId: "abc123" }],
  websites: [{ id: 300, trusted: true, url: "https://example.com", websiteType: { id: 1, name: "official" } }],
});

const createRedisClient = () => {
  const multi = {
    del: vi.fn().mockReturnThis(),
    exec: vi.fn().mockResolvedValue([[null, "OK"]]),
    sadd: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    srem: vi.fn().mockReturnThis(),
  };

  return {
    mget: vi.fn(),
    multi: vi.fn(() => multi),
    smembers: vi.fn().mockResolvedValue([]),
    multiPipeline: multi,
  };
};

const createService = () => {
  const dataSource = {
    query: vi.fn(),
  } as unknown as Mocked<DataSource>;
  const redisClient = createRedisClient();
  const redisService = {
    client: redisClient,
  } as unknown as RedisService;
  const logger = {
    debug: vi.fn(),
    error: vi.fn(),
    setContext: vi.fn(),
    warn: vi.fn(),
  };

  return {
    dataSource,
    logger,
    redisClient,
    service: new GamesService(dataSource, logger as never, redisService),
  };
};

describe("GamesService", () => {
  it("should map Steam source slugs and return cached app metadata", async () => {
    const { dataSource, redisClient, service } = createService();
    const cachedGame = createCachedGame();
    void dataSource.query.mockResolvedValueOnce([{ externalGameId: "570", igdbId: 42 }]);
    void redisClient.mget.mockResolvedValueOnce([JSON.stringify(cachedGame)]);

    await expect(service.findByExternalIds("steam", ["570"])).resolves.toEqual([
      {
        ageRatings: [{ descriptions: ["Violence"], id: "41", name: "Mature 17+", organization: "ESRB" }],
        artworks: [
          {
            height: 1080,
            url: "https://images.igdb.com/igdb/image/upload/t_1080p/art-1.webp",
            width: 1920,
          },
        ],
        cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/cover-1.webp",
        developers: [{ id: "10", igdbId: 10, name: "Dev Studio" }],
        externalGameId: "570",
        firstReleaseDate: "2024-01-01T00:00:00.000Z",
        gameModes: [{ id: "1", igdbId: 1, name: "Single player" }],
        genres: [{ id: "3", igdbId: 3, name: "Adventure" }],
        igdbId: 42,
        multiplayerModes: [
          {
            campaignCoop: false,
            dropIn: false,
            id: "901",
            igdbId: 901,
            lanCoop: false,
            offlineCoop: false,
            offlineCoopMax: 0,
            offlineMax: 1,
            onlineCoop: true,
            onlineCoopMax: 5,
            onlineMax: 10,
            platform: 6,
            splitscreen: false,
            splitscreenOnline: false,
          },
        ],
        name: "Dota 2",
        platforms: [{ id: "6", igdbId: 6, name: "PC" }],
        playerPerspectives: [],
        publishers: [{ id: "11", igdbId: 11, name: "Publisher" }],
        screenshots: ["https://images.igdb.com/igdb/image/upload/t_1080p/shot-1.webp"],
        sortableName: "Dota 2",
        source: "steam",
        storyline: "Story",
        summary: "Summary",
        videos: ["abc123"],
        websites: [{ id: "300", igdbId: 300, url: "https://example.com", websiteType: "official" }],
      },
    ]);
    expect(dataSource.query).toHaveBeenCalledWith(expect.stringContaining("external_games"), [1, ["570"]]);
    expect(redisClient.mget).toHaveBeenCalledWith("game:42");
  });

  it("should resolve Redis misses from Postgres and write the cache", async () => {
    const { dataSource, redisClient, service } = createService();
    const cachedGame = createCachedGame();
    void dataSource.query
      .mockResolvedValueOnce([{ externalGameId: "570", igdbId: 42 }])
      .mockResolvedValueOnce([{ game: cachedGame }]);
    void redisClient.mget.mockResolvedValueOnce([null]);

    await expect(service.findByExternalIds("steam", ["570"])).resolves.toEqual([
      expect.objectContaining({ externalGameId: "570", igdbId: 42, source: "steam" }),
    ]);
    expect(dataSource.query).toHaveBeenCalledWith(expect.stringContaining('g."igdbId" = ANY'), [[42]]);
    expect(redisClient.multiPipeline.set).toHaveBeenCalledWith("game:42", expect.any(String));
    expect(JSON.parse(redisClient.multiPipeline.set.mock.calls[0][1] as string)).toMatchObject({
      developers: [{ id: 10, name: "Dev Studio" }],
      id: 42,
      publishers: [{ id: 11, name: "Publisher" }],
    });
  });

  it("should omit unknown external game ids", async () => {
    const { dataSource, redisClient, service } = createService();
    void dataSource.query.mockResolvedValueOnce([]);

    await expect(service.findByExternalIds("gog", ["missing"])).resolves.toEqual([]);
    expect(redisClient.mget).not.toHaveBeenCalled();
  });

  it("should fall back to Postgres when Redis reads fail", async () => {
    const { dataSource, redisClient, service } = createService();
    const cachedGame = createCachedGame();
    void dataSource.query
      .mockResolvedValueOnce([{ externalGameId: "570", igdbId: 42 }])
      .mockResolvedValueOnce([{ game: cachedGame }]);
    void redisClient.mget.mockRejectedValueOnce(new Error("redis unavailable"));

    await expect(service.findByExternalIds("steam", ["570"])).resolves.toEqual([
      expect.objectContaining({ externalGameId: "570", igdbId: 42, source: "steam" }),
    ]);
    expect(dataSource.query).toHaveBeenCalledWith(expect.stringContaining('g."igdbId" = ANY'), [[42]]);
  });

  it("should surface Postgres lookup failures", async () => {
    const { dataSource, service } = createService();
    const error = new Error("postgres unavailable");
    void dataSource.query.mockRejectedValueOnce(error);

    await expect(service.findByExternalIds("steam", ["570"])).rejects.toThrow(error);
  });
});
