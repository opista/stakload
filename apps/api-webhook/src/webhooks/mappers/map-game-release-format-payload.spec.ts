vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 75),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapGameReleaseFormatPayload } from "./map-game-release-format-payload";
import { readDate, readId, readString } from "./shared/mapper-utils";

describe("mapGameReleaseFormatPayload", () => {
  it("should map game release format payloads", () => {
    const payload = { checksum: "sum", format: "Digital", id: 75, updated_at: 1_704_067_200 };

    expect(mapGameReleaseFormatPayload(payload as never)).toEqual({
      checksum: "sum-text",
      format: "Digital-text",
      igdbId: 75,
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
    });
    expect(readString).toHaveBeenCalledTimes(2);
    expect(readId).toHaveBeenCalledWith(75);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
  });
});
