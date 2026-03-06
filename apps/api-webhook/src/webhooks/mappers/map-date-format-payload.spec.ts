vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 74),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapDateFormatPayload } from "./map-date-format-payload";
import { readDate, readId, readString } from "./shared/mapper-utils";

describe("mapDateFormatPayload", () => {
  it("should map date format payloads", () => {
    const payload = { checksum: "sum", format: "YYYY", id: 74, updated_at: 1_704_067_200 };

    expect(mapDateFormatPayload(payload as never)).toEqual({
      checksum: "sum-text",
      format: "YYYY-text",
      igdbId: 74,
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
    });
    expect(readString).toHaveBeenCalledTimes(2);
    expect(readId).toHaveBeenCalledWith(74);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
  });
});
