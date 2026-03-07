vi.mock("./shared/mapper-utils", () => ({
  readBoolean: vi.fn(() => true),
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 66),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapWebsitePayload } from "./map-website-payload";
import { readBoolean, readDate, readId, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapWebsitePayload", () => {
  it("should map website payloads", () => {
    const payload = {
      checksum: "checksum",
      game: 2,
      id: 66,
      trusted: true,
      type: 4,
      updated_at: 1_704_067_200,
      url: "url",
    };

    expect(mapWebsitePayload(payload as never)).toEqual({
      checksum: "checksum-text",
      game: "2-id",
      igdbId: 66,
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      trusted: true,
      type: "4-id",
      url: "url-text",
    });
    expect(readString).toHaveBeenCalledTimes(2);
    expect(readId).toHaveBeenCalledWith(66);
    expect(readOptionalId).toHaveBeenCalledTimes(2);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
    expect(readBoolean).toHaveBeenCalledWith(true);
  });
});
