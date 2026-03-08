vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 71),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapAlternativeNamePayload } from "./map-alternative-name-payload";
import { readDate, readId, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapAlternativeNamePayload", () => {
  it("should map alternative name payloads", () => {
    const payload = { checksum: "sum", comment: "c", game: 4, id: 71, name: "alt", updated_at: 1_704_067_200 };

    expect(mapAlternativeNamePayload(payload as never)).toEqual({
      checksum: "sum-text",
      comment: "c-text",
      gameId: "4-id",
      igdbId: 71,
      name: "alt-text",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
    });
    expect(readString).toHaveBeenCalledTimes(3);
    expect(readOptionalId).toHaveBeenCalledWith(4);
    expect(readId).toHaveBeenCalledWith(71);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
  });
});
