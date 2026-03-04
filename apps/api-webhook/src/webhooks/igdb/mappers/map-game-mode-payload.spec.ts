vi.mock("./shared/mapper-utils", () => ({
  mapBaseSlugged: vi.fn(() => ({ base: "slugged" })),
}));

import { mapGameModePayload } from "./map-game-mode-payload";
import { mapBaseSlugged } from "./shared/mapper-utils";

describe("mapGameModePayload", () => {
  it("should map game mode payloads", () => {
    expect(mapGameModePayload({} as never)).toEqual({ base: "slugged" });
    expect(mapBaseSlugged).toHaveBeenCalled();
  });
});
