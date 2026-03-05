vi.mock("./shared/mapper-utils", () => ({
  mapBaseImageAsset: vi.fn(() => ({ base: "image" })),
}));

import { mapPlatformLogoPayload } from "./map-platform-logo-payload";
import { mapBaseImageAsset } from "./shared/mapper-utils";

describe("mapPlatformLogoPayload", () => {
  it("should map platform logo payloads", () => {
    expect(mapPlatformLogoPayload({} as never)).toEqual({ base: "image" });
    expect(mapBaseImageAsset).toHaveBeenCalled();
  });
});
