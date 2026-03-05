vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 88),
  readString: vi.fn(() => "region-text"),
}));

import { mapReleaseDateRegionPayload } from "./map-release-date-region-payload";
import { readDate, readId, readString } from "./shared/mapper-utils";

describe("mapReleaseDateRegionPayload", () => {
  it("should map release date region payloads", () => {
    expect(
      mapReleaseDateRegionPayload({
        checksum: "checksum",
        id: 88,
        region: "Europe",
        updated_at: 1_704_067_200,
      } as never),
    ).toEqual({
      checksum: "region-text",
      igdbId: 88,
      region: "region-text",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
    });
    expect(readString).toHaveBeenCalledTimes(2);
    expect(readId).toHaveBeenCalledWith(88);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
  });
});
