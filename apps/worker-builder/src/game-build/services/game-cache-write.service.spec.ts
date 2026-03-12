import { TestBed } from "@suites/unit";
import type { Mocked } from "vitest";

import { PinoLogger } from "@stakload/nestjs-logging";
import { RedisService } from "@stakload/nestjs-redis";

import type { GameDto } from "../../models/dto/game.dto";
import { GameCacheWriteService } from "./game-cache-write.service";

describe("GameCacheWriteService", () => {
  let logger: Mocked<PinoLogger>;
  let redisService: Mocked<RedisService>;
  let service: GameCacheWriteService;

  const createGame = (): GameDto => ({
    aggregatedRating: null,
    aggregatedRatingCount: null,
    artworks: [],
    cover: null,
    firstReleaseDate: 1_704_067_200,
    gameModes: [],
    gameStatus: null,
    gameType: null,
    genres: [
      { id: 3, name: "Adventure" },
      { id: 3, name: "Adventure" },
      { id: 5, name: "Shooter" },
    ],
    id: 42,
    involvedCompanies: [
      {
        id: 1,
        company: { id: 10, name: "Dev Studio" },
        developer: true,
        publisher: false,
        porting: false,
        supporting: false,
      },
    ],
    keywords: [],
    name: "Example Game",
    platforms: [{ id: 6, name: "PC" }],
    playerPerspectives: [],
    rating: 77.4,
    ratingCount: null,
    screenshots: [],
    slug: null,
    storyline: null,
    summary: "Example summary",
    themes: [{ id: 18, name: "Sci-fi" }],
    totalRating: null,
    totalRatingCount: null,
    url: null,
    videos: [],
  });

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(GameCacheWriteService).compile();

    service = unit;
    logger = unitRef.get(PinoLogger) as unknown as Mocked<PinoLogger>;
    redisService = unitRef.get(RedisService) as unknown as Mocked<RedisService>;
  });

  it("should write the game payload and dependency sets in one Redis multi transaction", async () => {
    const game = createGame();
    const multi = {
      exec: vi.fn().mockResolvedValue([
        [null, "OK"],
        [null, 1],
        [null, 1],
        [null, 1],
        [null, 1],
        [null, 1],
      ]),
      sadd: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    };
    const client = {
      multi: vi.fn().mockReturnValue(multi),
    };

    Object.defineProperty(redisService, "client", {
      configurable: true,
      value: client,
    });

    await expect(service.cacheGameAndDependencies(game)).resolves.toBeUndefined();

    expect(client.multi).toHaveBeenCalledTimes(1);
    expect(multi.set).toHaveBeenCalledWith("game:42", JSON.stringify(game));
    expect(multi.sadd).toHaveBeenCalledTimes(5);
    expect(multi.sadd).toHaveBeenCalledWith("genre:3:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("genre:5:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("platform:6:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("theme:18:games", 42);
    expect(multi.sadd).toHaveBeenCalledWith("company:10:games", 42);
    expect(multi.exec).toHaveBeenCalledTimes(1);
  });

  it("should throw when Redis returns no transaction results", async () => {
    const multi = {
      exec: vi.fn().mockResolvedValue(null),
      sadd: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    };
    const client = {
      multi: vi.fn().mockReturnValue(multi),
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
      exec: vi.fn().mockResolvedValue([[writeError, null]]),
      sadd: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    };
    const client = {
      multi: vi.fn().mockReturnValue(multi),
    };

    Object.defineProperty(redisService, "client", {
      configurable: true,
      value: client,
    });

    await expect(service.cacheGameAndDependencies(createGame())).rejects.toThrow("set failed");
    expect(logger.error).toHaveBeenCalledWith({ err: writeError, gameId: 42 }, "Failed to cache game build payload");
  });
});
