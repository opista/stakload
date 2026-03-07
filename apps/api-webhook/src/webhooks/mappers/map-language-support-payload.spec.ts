vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 81),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapLanguageSupportPayload } from "./map-language-support-payload";
import { readDate, readId, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapLanguageSupportPayload", () => {
  it("should map language support payloads", () => {
    const payload = {
      checksum: "sum",
      game: 3,
      id: 81,
      language: 4,
      language_support_type: 5,
      updated_at: 1_704_067_200,
    };

    expect(mapLanguageSupportPayload(payload as never)).toEqual({
      checksum: "sum-text",
      game: "3-id",
      igdbId: 81,
      language: "4-id",
      languageSupportType: "5-id",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
    });
    expect(readString).toHaveBeenCalledWith("sum");
    expect(readOptionalId).toHaveBeenCalledTimes(3);
    expect(readId).toHaveBeenCalledWith(81);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
  });
});
