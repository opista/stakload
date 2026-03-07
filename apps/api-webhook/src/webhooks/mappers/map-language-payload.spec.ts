vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 82),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapLanguagePayload } from "./map-language-payload";
import { readDate, readId, readString } from "./shared/mapper-utils";

describe("mapLanguagePayload", () => {
  it("should map language payloads", () => {
    const payload = {
      checksum: "sum",
      id: 82,
      locale: "en-GB",
      name: "English",
      native_name: "English",
      updated_at: 1_704_067_200,
    };

    expect(mapLanguagePayload(payload as never)).toEqual({
      checksum: "sum-text",
      igdbId: 82,
      locale: "en-GB-text",
      name: "English-text",
      nativeName: "English-text",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
    });
    expect(readString).toHaveBeenCalledTimes(4);
    expect(readId).toHaveBeenCalledWith(82);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
  });
});
