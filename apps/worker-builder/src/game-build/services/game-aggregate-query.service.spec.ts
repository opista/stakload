import { TestBed } from "@suites/unit";
import { DataSource } from "typeorm";
import type { Mocked } from "vitest";

import { PinoLogger } from "@stakload/nestjs-logging";

import { GameAggregateQueryService } from "./game-aggregate-query.service";

describe("GameAggregateQueryService", () => {
  let dataSource: Mocked<DataSource>;
  let logger: Mocked<PinoLogger>;
  let service: GameAggregateQueryService;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(GameAggregateQueryService).compile();

    service = unit;
    dataSource = unitRef.get(DataSource) as unknown as Mocked<DataSource>;
    logger = unitRef.get(PinoLogger) as unknown as Mocked<PinoLogger>;
  });

  it("returns null when no game is found", async () => {
    void dataSource.query.mockResolvedValueOnce([]);

    await expect(service.fetchByGameId(404)).resolves.toBeNull();
    expect(dataSource.query).toHaveBeenCalledWith(expect.any(String), [404]);
  });

  it("executes a raw SQL query with UNNEST and maps the result", async () => {
    void dataSource.query.mockResolvedValueOnce([
      {
        game: {
          cover: null,
          firstReleaseDate: 1_704_067_200,
          genres: [{ id: 3, name: "Adventure" }],
          id: 42,
          name: "Example Game",
          platforms: [],
          rating: 78.9,
          summary: "Example summary",
          themes: [],
        },
      },
    ]);

    await expect(service.fetchByGameId(42)).resolves.toMatchObject({
      genres: [{ id: 3, name: "Adventure" }],
      id: 42,
      name: "Example Game",
    });
    expect(dataSource.query.mock.calls.at(0)?.at(0)).toContain('UNNEST(g."genres")');
  });

  it("logs and rethrows mapper failures", async () => {
    void dataSource.query.mockResolvedValueOnce([
      {
        game: "{not-valid-json}",
      },
    ]);

    await expect(service.fetchByGameId(42)).rejects.toThrow("Failed to parse aggregated game payload from Postgres");
    expect(logger.error).toHaveBeenCalledWith(
      { err: expect.any(Error), gameId: 42 },
      "Failed to map aggregated game payload",
    );
  });
});
