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
          ageRatings: [
            {
              categoryId: 2,
              contentDescriptionIds: [55],
              descriptions: ["Violence"],
              id: 41,
              name: "Mature 17+",
              organisationId: 9,
              organisation: "ESRB",
            },
          ],
          aggregatedRating: null,
          aggregatedRatingCount: null,
          artworks: [],
          cover: null,
          firstReleaseDate: 1_704_067_200,
          gameModes: [],
          gameStatus: null,
          gameType: null,
          genres: [{ id: 3, name: "Adventure" }],
          id: 42,
          involvedCompanies: [
            {
              company: { id: 10, name: "Dev Studio" },
              developer: true,
              id: 1,
              porting: false,
              publisher: true,
              supporting: false,
            },
          ],
          keywords: [],
          name: "Example Game",
          platforms: [],
          playerPerspectives: [],
          rating: 78.9,
          ratingCount: null,
          screenshots: [],
          slug: null,
          storyline: null,
          summary: "Example summary",
          themes: [],
          totalRating: null,
          totalRatingCount: null,
          url: null,
          videos: [],
          websites: [],
        },
      },
    ]);

    await expect(service.fetchByGameId(42)).resolves.toMatchObject({
      ageRatings: [{ id: 41 }],
      developers: [{ id: 10, name: "Dev Studio" }],
      genres: [{ id: 3, name: "Adventure" }],
      id: 42,
      name: "Example Game",
      publishers: [{ id: 10, name: "Dev Studio" }],
    });
    expect(dataSource.query.mock.calls.at(0)?.at(0)).toContain('UNNEST(g."genres")');
    expect(dataSource.query.mock.calls.at(0)?.at(0)).toContain("age_rating_categories");
    expect(dataSource.query.mock.calls.at(0)?.at(0)).toContain("age_rating_organizations");
    expect(dataSource.query.mock.calls.at(0)?.at(0)).toContain("age_rating_content_descriptions_v2");
    expect(dataSource.query.mock.calls.at(0)?.at(0)).toContain("alternative_names");
    expect(dataSource.query.mock.calls.at(0)?.at(0)).toContain("external_games");
    expect(dataSource.query.mock.calls.at(0)?.at(0)).toContain("language_supports");
    expect(dataSource.query.mock.calls.at(0)?.at(0)).toContain("multiplayer_modes");
    expect(dataSource.query.mock.calls.at(0)?.at(0)).toContain("website_types");
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
