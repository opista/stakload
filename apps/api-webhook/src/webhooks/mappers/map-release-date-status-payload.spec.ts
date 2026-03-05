vi.mock("./shared/mapper-utils", () => ({
  mapBaseNamed: vi.fn(() => ({ base: "named" })),
  readString: vi.fn(() => "description-text"),
}));

import { mapReleaseDateStatusPayload } from "./map-release-date-status-payload";
import { mapBaseNamed, readString } from "./shared/mapper-utils";

describe("mapReleaseDateStatusPayload", () => {
  it("should map release date status payloads", () => {
    expect(mapReleaseDateStatusPayload({ description: "desc" } as never)).toEqual({
      base: "named",
      description: "description-text",
    });
    expect(mapBaseNamed).toHaveBeenCalled();
    expect(readString).toHaveBeenCalledWith("desc");
  });
});
