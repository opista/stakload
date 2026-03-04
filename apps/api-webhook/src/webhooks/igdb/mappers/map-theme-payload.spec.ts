vi.mock("./shared/mapper-utils", () => ({
  mapBaseSlugged: vi.fn(() => ({ base: "slugged" })),
}));

import { mapThemePayload } from "./map-theme-payload";
import { mapBaseSlugged } from "./shared/mapper-utils";

describe("mapThemePayload", () => {
  it("should map theme payloads", () => {
    expect(mapThemePayload({} as never)).toEqual({ base: "slugged" });
    expect(mapBaseSlugged).toHaveBeenCalled();
  });
});
