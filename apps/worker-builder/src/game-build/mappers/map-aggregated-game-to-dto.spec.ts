import { mapAggregatedGameToDto, type RawAggregatedGameDto } from "./map-aggregated-game-to-dto";

describe("mapAggregatedGameToDto", () => {
  const createBaseGame = (): RawAggregatedGameDto => ({
    ageRatings: [
      {
        descriptions: ["Violence", "Strong language"],
        id: 7,
        name: "Mature 17+",
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
    genres: [{ id: 5, name: "Shooter" }],
    id: 42,
    involvedCompanies: [
      {
        company: { id: 12, name: "Gamma Studio" },
        developer: true,
        id: 4,
        porting: false,
        publisher: false,
        supporting: false,
      },
      {
        company: { id: 8, name: "Alpha Works" },
        developer: true,
        id: 5,
        porting: false,
        publisher: false,
        supporting: false,
      },
      {
        company: { id: 8, name: "Alpha Works" },
        developer: false,
        id: 6,
        porting: false,
        publisher: true,
        supporting: false,
      },
      {
        company: { id: 3, name: "Beta Publishing" },
        developer: false,
        id: 7,
        porting: false,
        publisher: true,
        supporting: false,
      },
    ],
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
    websites: [
      {
        id: 99,
        trusted: true,
        url: "https://example.com",
        websiteType: { id: 1, name: "official" },
      },
    ],
  });

  it("maps object payloads and derives company role arrays", () => {
    const base = createBaseGame();
    const dto = mapAggregatedGameToDto(base);
    const { involvedCompanies, ...baseWithoutCompanies } = base;
    void involvedCompanies;

    expect(dto).toEqual({
      ...baseWithoutCompanies,
      developers: [
        { id: 8, name: "Alpha Works" },
        { id: 12, name: "Gamma Studio" },
      ],
      publishers: [
        { id: 3, name: "Beta Publishing" },
        { id: 8, name: "Alpha Works" },
      ],
    });
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
