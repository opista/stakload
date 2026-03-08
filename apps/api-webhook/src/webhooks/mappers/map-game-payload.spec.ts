vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 10),
  readIds: vi.fn(() => [41, 42]),
  readNumber: vi.fn(() => 42),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapGamePayload } from "./map-game-payload";
import { readDate, readId, readIds, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapGamePayload", () => {
  it("should map game payloads", () => {
    const payload = {
      age_ratings: [{ id: 1 }],
      aggregated_rating: 1,
      aggregated_rating_count: 2,
      alternative_names: [{ id: 2 }],
      artworks: [{ id: 3 }],
      bundles: [{ id: 4 }],
      checksum: "checksum",
      cover: 4,
      external_games: [{ id: 5 }],
      first_release_date: 1_704_067_200,
      franchise: 13,
      game_engines: [{ id: 6 }],
      game_status: 5,
      game_type: 3,
      id: 10,
      language_supports: [{ id: 7 }],
      multiplayer_modes: [{ id: 8 }],
      name: "name",
      parent_game: 6,
      rating: 7,
      rating_count: 8,
      similar_games: [{ id: 9 }],
      slug: "slug",
      storyline: "storyline",
      summary: "summary",
      total_rating: 9,
      total_rating_count: 10,
      updated_at: 1_704_067_200,
      url: "url",
      version_parent: 11,
      version_title: "version",
      videos: [{ id: 10 }],
    };

    expect(mapGamePayload(payload as never)).toEqual({
      ageRatingIds: [41, 42],
      aggregatedRating: 42,
      aggregatedRatingCount: 42,
      alternativeNameIds: [41, 42],
      artworkIds: [41, 42],
      bundleIds: [41, 42],
      checksum: "checksum-text",
      coverId: "4-id",
      externalGameIds: [41, 42],
      firstReleaseDate: new Date("2024-01-01T00:00:00.000Z"),
      franchiseId: "13-id",
      gameEngineIds: [41, 42],
      gameStatusId: "5-id",
      gameTypeId: "3-id",
      igdbId: 10,
      languageSupportIds: [41, 42],
      multiplayerModeIds: [41, 42],
      name: "name-text",
      parentGameId: "6-id",
      rating: 42,
      ratingCount: 42,
      similarGameIds: [41, 42],
      slug: "slug-text",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      storyline: "storyline-text",
      summary: "summary-text",
      totalRating: 42,
      totalRatingCount: 42,
      url: "url-text",
      versionParentId: "11-id",
      versionTitle: "version-text",
      videoIds: [41, 42],
    });
    expect(readDate).toHaveBeenCalledTimes(2);
    expect(readId).toHaveBeenCalledWith(10);
    expect(readIds).toHaveBeenCalledTimes(10);
    expect(readNumber).toHaveBeenCalledTimes(6);
    expect(readOptionalId).toHaveBeenCalledTimes(6);
    expect(readString).toHaveBeenCalledTimes(7);
  });
});
