vi.mock("./shared/mapper-utils", () => ({
  mapBaseImageAsset: vi.fn(() => ({ base: "image" })),
  readId: vi.fn(() => 21),
}));

import { mapScreenshotPayload } from "./map-screenshot-payload";
import { mapBaseImageAsset, readId } from "./shared/mapper-utils";

describe("mapScreenshotPayload", () => {
  it("should map screenshot payloads", () => {
    expect(mapScreenshotPayload({ game: { id: 21 } } as never)).toEqual({
      base: "image",
      gameId: 21,
    });
    expect(mapBaseImageAsset).toHaveBeenCalled();
    expect(readId).toHaveBeenCalledWith({ id: 21 });
  });
});
