vi.mock("./shared/mapper-utils", () => ({
  mapBaseImageAsset: vi.fn(() => ({ base: "image" })),
}));

import { mapGameEngineLogoPayload } from "./map-game-engine-logo-payload";
import { mapBaseImageAsset } from "./shared/mapper-utils";

describe("mapGameEngineLogoPayload", () => {
  it("should map game engine logo payloads", () => {
    expect(mapGameEngineLogoPayload({} as never)).toEqual({ base: "image" });
    expect(mapBaseImageAsset).toHaveBeenCalled();
  });
});
