vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 10),
  readNumber: vi.fn(() => 42),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapGamePayload } from "./map-game-payload";
import { readDate, readId, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapGamePayload", () => {
  it("should map game payloads", () => {
    const payload = {
      aggregated_rating: 1,
      aggregated_rating_count: 2,
      checksum: "checksum",
      cover: 4,
      first_release_date: 1_704_067_200,
      game_status: 5,
      game_type: 3,
      id: 10,
      name: "name",
      parent_game: 6,
      rating: 7,
      rating_count: 8,
      slug: "slug",
      storyline: "storyline",
      summary: "summary",
      total_rating: 9,
      total_rating_count: 10,
      updated_at: 1_704_067_200,
      url: "url",
      version_parent: 11,
      version_title: "version",
    };

    expect(mapGamePayload(payload as never)).toEqual({
      aggregatedRating: 42,
      aggregatedRatingCount: 42,
      checksum: "checksum-text",
      coverId: "4-id",
      firstReleaseDate: new Date("2024-01-01T00:00:00.000Z"),
      gameStatusId: "5-id",
      gameTypeId: "3-id",
      igdbId: 10,
      name: "name-text",
      parentGameId: "6-id",
      rating: 42,
      ratingCount: 42,
      slug: "slug-text",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      storyline: "storyline-text",
      summary: "summary-text",
      totalRating: 42,
      totalRatingCount: 42,
      url: "url-text",
      versionParentId: "11-id",
      versionTitle: "version-text",
    });
    expect(readDate).toHaveBeenCalledTimes(2);
    expect(readId).toHaveBeenCalledWith(10);
    expect(readNumber).toHaveBeenCalledTimes(6);
    expect(readOptionalId).toHaveBeenCalledTimes(5);
    expect(readString).toHaveBeenCalledTimes(7);
  });
});
