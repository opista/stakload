vi.mock("./shared/mapper-utils", () => ({
  mapBaseSlugged: vi.fn(() => ({ base: "slugged" })),
  readIds: vi.fn(() => [1, 2]),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapGameEnginePayload } from "./map-game-engine-payload";
import { mapBaseSlugged, readIds, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapGameEnginePayload", () => {
  it("should map game engine payloads", () => {
    const payload = { companies: [1], description: "desc", logo: 5, platforms: [6] };

    expect(mapGameEnginePayload(payload as never)).toEqual({
      base: "slugged",
      companyIds: [1, 2],
      description: "desc-text",
      logoId: "5-id",
      platformIds: [1, 2],
    });
    expect(mapBaseSlugged).toHaveBeenCalled();
    expect(readIds).toHaveBeenCalledTimes(2);
    expect(readString).toHaveBeenCalledWith("desc");
    expect(readOptionalId).toHaveBeenCalledWith(5);
  });
});
