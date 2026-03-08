vi.mock("./shared/mapper-utils", () => ({
  mapBaseImageAsset: vi.fn(() => ({ base: "image" })),
  readId: vi.fn(() => 55),
  readOptionalId: vi.fn(() => 12),
}));

import { mapArtworkPayload } from "./map-artwork-payload";
import { mapBaseImageAsset, readId, readOptionalId } from "./shared/mapper-utils";

describe("mapArtworkPayload", () => {
  it("should map artwork payloads", () => {
    expect(mapArtworkPayload({ artwork_type: 12, game: { id: 55 } } as never)).toEqual({
      artworkType: 12,
      base: "image",
      game: 55,
    });
    expect(mapBaseImageAsset).toHaveBeenCalled();
    expect(readOptionalId).toHaveBeenCalledWith(12);
    expect(readId).toHaveBeenCalledWith({ id: 55 });
  });
});
