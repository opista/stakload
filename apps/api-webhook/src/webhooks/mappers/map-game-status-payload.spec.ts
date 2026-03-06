vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 76),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapGameStatusPayload } from "./map-game-status-payload";
import { readDate, readId, readString } from "./shared/mapper-utils";

describe("mapGameStatusPayload", () => {
  it("should map game status payloads", () => {
    const payload = { checksum: "sum", id: 76, status: "Released", updated_at: 1_704_067_200 };

    expect(mapGameStatusPayload(payload as never)).toEqual({
      checksum: "sum-text",
      igdbId: 76,
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      status: "Released-text",
    });
    expect(readString).toHaveBeenCalledTimes(2);
    expect(readId).toHaveBeenCalledWith(76);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
  });
});
