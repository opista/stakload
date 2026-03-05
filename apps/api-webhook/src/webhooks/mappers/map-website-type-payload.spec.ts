vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 90),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapWebsiteTypePayload } from "./map-website-type-payload";
import { readDate, readId, readString } from "./shared/mapper-utils";

describe("mapWebsiteTypePayload", () => {
  it("should map website type payloads", () => {
    expect(
      mapWebsiteTypePayload({
        checksum: "checksum",
        id: 90,
        type: "official",
        updated_at: 1_704_067_200,
      } as never),
    ).toEqual({
      checksum: "checksum-text",
      igdbId: 90,
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      type: "official-text",
    });
    expect(readString).toHaveBeenCalledTimes(2);
    expect(readId).toHaveBeenCalledWith(90);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
  });
});
