import { mapAggregatedGameToDto, type RawAggregatedGameDto } from "./map-aggregated-game-to-dto";

describe("mapAggregatedGameToDto", () => {
  const createBaseGame = (): RawAggregatedGameDto => ({
    ageRatings: [
      {
        categoryId: 2,
        contentDescriptionIds: [11, 12],
        descriptions: ["Violence", "Strong language"],
        id: 7,
        name: "Mature 17+",
        organisationId: 4,
        organisation: "ESRB",
      },
    ],
    aggregatedRating: null,
    aggregatedRatingCount: null,
    alternativeNames: [],
    artworks: [],
    bundles: [],
    checksum: null,
    collections: [],
    cover: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    externalGames: [],
    firstReleaseDate: 1_704_067_200,
    franchise: null,
    franchises: [],
    gameEngines: [],
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
    languageSupports: [],
    multiplayerModes: [],
    name: "Example Game",
    parentGame: null,
    platforms: [],
    playerPerspectives: [],
    rating: 81.4,
    ratingCount: null,
    screenshots: [],
    similarGames: [],
    slug: null,
    sourceUpdatedAt: null,
    storyline: null,
    summary: "Example summary",
    themes: [],
    totalRating: null,
    totalRatingCount: null,
    updatedAt: "2026-01-01T00:00:00.000Z",
    url: null,
    versionParent: null,
    versionTitle: null,
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

    expect(dto).toEqual({
      ...base,
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
