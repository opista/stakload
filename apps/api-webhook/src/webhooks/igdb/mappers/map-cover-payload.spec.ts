vi.mock("./shared/mapper-utils", () => ({
  mapBaseImageAsset: vi.fn(() => ({ base: "image" })),
  readId: vi.fn(() => 77),
}));

import { mapCoverPayload } from "./map-cover-payload";
import { mapBaseImageAsset, readId } from "./shared/mapper-utils";

describe("mapCoverPayload", () => {
  it("should map cover payloads", () => {
    expect(mapCoverPayload({ game: { id: 77 } } as never)).toEqual({
      base: "image",
      gameId: 77,
    });
    expect(mapBaseImageAsset).toHaveBeenCalled();
    expect(readId).toHaveBeenCalledWith({ id: 77 });
  });
});
