vi.mock("./shared/mapper-utils", () => ({
  mapBaseImageAsset: vi.fn(() => ({ base: "image" })),
  readId: vi.fn(() => 55),
}));

import { mapArtworkPayload } from "./map-artwork-payload";
import { mapBaseImageAsset, readId } from "./shared/mapper-utils";

describe("mapArtworkPayload", () => {
  it("should map artwork payloads", () => {
    expect(mapArtworkPayload({ game: { id: 55 } } as never)).toEqual({
      base: "image",
      gameId: 55,
    });
    expect(mapBaseImageAsset).toHaveBeenCalled();
    expect(readId).toHaveBeenCalledWith({ id: 55 });
  });
});
