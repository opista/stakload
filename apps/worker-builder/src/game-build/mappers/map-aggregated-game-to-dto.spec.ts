import type { GameDto } from "../../models/dto/game.dto";
import { mapAggregatedGameToDto } from "./map-aggregated-game-to-dto";

describe("mapAggregatedGameToDto", () => {
  const createBaseGame = (): GameDto => ({
    aggregatedRating: null,
    aggregatedRatingCount: null,
    artworks: [],
    cover: null,
    firstReleaseDate: 1_704_067_200,
    gameModes: [],
    gameStatus: null,
    gameType: null,
    genres: [{ id: 5, name: "Shooter" }],
    id: 42,
    involvedCompanies: [],
    keywords: [],
    name: "Example Game",
    platforms: [],
    playerPerspectives: [],
    rating: 81.4,
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
  });

  it("maps object payloads directly", () => {
    const dto = mapAggregatedGameToDto(createBaseGame());

    expect(dto).toEqual(createBaseGame());
  });

  it("maps string payloads from Postgres JSON output", () => {
    const dto = mapAggregatedGameToDto(
      JSON.stringify({
        ...createBaseGame(),
        firstReleaseDate: "1704067200",
      }),
    );

    expect(dto.firstReleaseDate).toBe(1_704_067_200);
  });

  it("returns null for invalid firstReleaseDate values", () => {
    const dto = mapAggregatedGameToDto({
      ...createBaseGame(),
      firstReleaseDate: "not-a-number",
    });

    expect(dto.firstReleaseDate).toBeNull();
  });

  it("throws when the payload is not valid JSON", () => {
    expect(() => mapAggregatedGameToDto("{not-valid-json}")).toThrow(
      "Failed to parse aggregated game payload from Postgres",
    );
  });
});
