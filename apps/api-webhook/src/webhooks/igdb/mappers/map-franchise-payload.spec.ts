vi.mock("./shared/mapper-utils", () => ({
  mapBaseSlugged: vi.fn(() => ({ base: "slugged" })),
}));

import { mapFranchisePayload } from "./map-franchise-payload";
import { mapBaseSlugged } from "./shared/mapper-utils";

describe("mapFranchisePayload", () => {
  it("should map franchise payloads", () => {
    expect(mapFranchisePayload({} as never)).toEqual({ base: "slugged" });
    expect(mapBaseSlugged).toHaveBeenCalled();
  });
});
