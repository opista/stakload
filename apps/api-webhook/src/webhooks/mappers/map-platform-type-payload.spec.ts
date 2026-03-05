vi.mock("./shared/mapper-utils", () => ({
  mapBaseNamed: vi.fn(() => ({ base: "named" })),
}));

import { mapPlatformTypePayload } from "./map-platform-type-payload";
import { mapBaseNamed } from "./shared/mapper-utils";

describe("mapPlatformTypePayload", () => {
  it("should map platform type payloads", () => {
    expect(mapPlatformTypePayload({} as never)).toEqual({ base: "named" });
    expect(mapBaseNamed).toHaveBeenCalled();
  });
});
