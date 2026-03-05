vi.mock("./shared/mapper-utils", () => ({
  mapBaseSlugged: vi.fn(() => ({ base: "slugged" })),
  readString: vi.fn(() => "description"),
}));

import { mapCollectionPayload } from "./map-collection-payload";
import { mapBaseSlugged, readString } from "./shared/mapper-utils";

describe("mapCollectionPayload", () => {
  it("should map collection payloads", () => {
    expect(mapCollectionPayload({ description: "desc" } as never)).toEqual({
      base: "slugged",
      description: "description",
    });
    expect(mapBaseSlugged).toHaveBeenCalled();
    expect(readString).toHaveBeenCalledWith("desc");
  });
});
