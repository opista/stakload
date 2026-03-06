vi.mock("./shared/mapper-utils", () => ({
  mapBaseSlugged: vi.fn(() => ({ base: "slugged" })),
}));

import { mapArtworkTypePayload } from "./map-artwork-type-payload";
import { mapBaseSlugged } from "./shared/mapper-utils";

describe("mapArtworkTypePayload", () => {
  it("should map artwork type payloads", () => {
    expect(mapArtworkTypePayload({} as never)).toEqual({ base: "slugged" });
    expect(mapBaseSlugged).toHaveBeenCalled();
  });
});
