vi.mock("./shared/mapper-utils", () => ({
  mapBaseSlugged: vi.fn(() => ({ base: "slugged" })),
}));

import { mapKeywordPayload } from "./map-keyword-payload";
import { mapBaseSlugged } from "./shared/mapper-utils";

describe("mapKeywordPayload", () => {
  it("should map keyword payloads", () => {
    expect(mapKeywordPayload({} as never)).toEqual({ base: "slugged" });
    expect(mapBaseSlugged).toHaveBeenCalled();
  });
});
