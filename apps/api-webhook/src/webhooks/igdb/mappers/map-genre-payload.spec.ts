vi.mock("./shared/mapper-utils", () => ({
  mapBaseSlugged: vi.fn(() => ({ base: "slugged" })),
}));

import { mapGenrePayload } from "./map-genre-payload";
import { mapBaseSlugged } from "./shared/mapper-utils";

describe("mapGenrePayload", () => {
  it("should map genre payloads", () => {
    expect(mapGenrePayload({} as never)).toEqual({ base: "slugged" });
    expect(mapBaseSlugged).toHaveBeenCalled();
  });
});
