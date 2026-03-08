vi.mock("./shared/mapper-utils", () => ({
  mapBaseNamed: vi.fn(() => ({ base: "named" })),
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 92),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import {
  mapAgeRatingCategoryPayload,
  mapAgeRatingContentDescriptionV2Payload,
  mapAgeRatingOrganizationPayload,
} from "./map-age-rating-lookups-payload";
import { mapBaseNamed, readDate, readId, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapAgeRatingLookupPayloads", () => {
  it("should map age rating organisation payloads", () => {
    expect(mapAgeRatingOrganizationPayload({} as never)).toEqual({ base: "named" });
    expect(mapBaseNamed).toHaveBeenCalled();
  });

  it("should map age rating category payloads", () => {
    const payload = { checksum: "sum", id: 10, organization: 4, rating: "M", updated_at: 1_704_067_200 };
    expect(mapAgeRatingCategoryPayload(payload as never)).toEqual({
      checksum: "sum-text",
      igdbId: 92,
      organization: "4-id",
      rating: "M-text",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
    });
  });

  it("should map age rating content description v2 payloads", () => {
    const payload = { checksum: "sum", description: "desc", id: 11, organization: 5, updated_at: 1_704_067_200 };
    expect(mapAgeRatingContentDescriptionV2Payload(payload as never)).toEqual({
      checksum: "sum-text",
      description: "desc-text",
      igdbId: 92,
      organization: "5-id",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
    });
    expect(readString).toHaveBeenCalled();
    expect(readId).toHaveBeenCalled();
    expect(readOptionalId).toHaveBeenCalled();
    expect(readDate).toHaveBeenCalled();
  });
});
