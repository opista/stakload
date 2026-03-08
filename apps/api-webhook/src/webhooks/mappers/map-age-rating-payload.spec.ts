vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 91),
  readIds: vi.fn(() => [11, 12]),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapAgeRatingPayload } from "./map-age-rating-payload";
import { readDate, readId, readIds, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapAgeRatingPayload", () => {
  it("should map age rating payloads", () => {
    const payload = {
      checksum: "sum",
      id: 91,
      organization: 7,
      rating_category: 8,
      rating_content_descriptions: [{ id: 11 }],
      rating_cover_url: "cover",
      synopsis: "text",
      updated_at: 1_704_067_200,
    };

    expect(mapAgeRatingPayload(payload as never)).toEqual({
      checksum: "sum-text",
      igdbId: 91,
      organizationId: "7-id",
      ratingCategoryId: "8-id",
      ratingContentDescriptionIds: [11, 12],
      ratingCoverUrl: "cover-text",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      synopsis: "text-text",
    });

    expect(readString).toHaveBeenCalledTimes(3);
    expect(readId).toHaveBeenCalledWith(91);
    expect(readOptionalId).toHaveBeenCalledTimes(2);
    expect(readIds).toHaveBeenCalledTimes(1);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
  });
});
