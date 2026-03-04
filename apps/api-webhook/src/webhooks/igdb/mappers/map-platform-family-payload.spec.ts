vi.mock("./shared/mapper-utils", () => ({
  mapBaseSlugged: vi.fn(() => ({ base: "slugged" })),
}));

import { mapPlatformFamilyPayload } from "./map-platform-family-payload";
import { mapBaseSlugged } from "./shared/mapper-utils";

describe("mapPlatformFamilyPayload", () => {
  it("should map platform family payloads", () => {
    expect(mapPlatformFamilyPayload({} as never)).toEqual({ base: "slugged" });
    expect(mapBaseSlugged).toHaveBeenCalled();
  });
});
