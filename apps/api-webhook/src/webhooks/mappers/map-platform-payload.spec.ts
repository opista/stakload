vi.mock("./shared/mapper-utils", () => ({
  mapBaseSlugged: vi.fn(() => ({ base: "slugged" })),
  readNumber: vi.fn(() => 4),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapPlatformPayload } from "./map-platform-payload";
import { mapBaseSlugged, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapPlatformPayload", () => {
  it("should map platform payloads", () => {
    const payload = {
      abbreviation: "abbr",
      alternative_name: "alt",
      generation: 9,
      platform_family: 1,
      platform_logo: 2,
      platform_type: 3,
      summary: "summary",
    };

    expect(mapPlatformPayload(payload as never)).toEqual({
      abbreviation: "abbr-text",
      alternativeName: "alt-text",
      base: "slugged",
      generation: 4,
      platformFamily: "1-id",
      platformLogo: "2-id",
      platformType: "3-id",
      summary: "summary-text",
    });
    expect(mapBaseSlugged).toHaveBeenCalled();
    expect(readNumber).toHaveBeenCalledTimes(1);
    expect(readOptionalId).toHaveBeenCalledTimes(3);
    expect(readString).toHaveBeenCalledTimes(3);
  });
});
