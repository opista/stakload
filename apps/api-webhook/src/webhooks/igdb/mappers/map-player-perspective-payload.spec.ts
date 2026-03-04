vi.mock("./shared/mapper-utils", () => ({
  mapBaseSlugged: vi.fn(() => ({ base: "slugged" })),
}));

import { mapPlayerPerspectivePayload } from "./map-player-perspective-payload";
import { mapBaseSlugged } from "./shared/mapper-utils";

describe("mapPlayerPerspectivePayload", () => {
  it("should map player perspective payloads", () => {
    expect(mapPlayerPerspectivePayload({} as never)).toEqual({ base: "slugged" });
    expect(mapBaseSlugged).toHaveBeenCalled();
  });
});
