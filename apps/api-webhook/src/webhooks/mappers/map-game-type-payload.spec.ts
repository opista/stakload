vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 77),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapGameTypePayload } from "./map-game-type-payload";
import { readDate, readId, readString } from "./shared/mapper-utils";

describe("mapGameTypePayload", () => {
  it("should map game type payloads", () => {
    const payload = { checksum: "sum", id: 77, type: "Shooter", updated_at: 1_704_067_200 };

    expect(mapGameTypePayload(payload as never)).toEqual({
      checksum: "sum-text",
      igdbId: 77,
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      type: "Shooter-text",
    });
    expect(readString).toHaveBeenCalledTimes(2);
    expect(readId).toHaveBeenCalledWith(77);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
  });
});
