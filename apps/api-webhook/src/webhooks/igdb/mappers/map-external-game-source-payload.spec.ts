vi.mock("./shared/mapper-utils", () => ({
  mapBaseNamed: vi.fn(() => ({ base: "named" })),
}));

import { mapExternalGameSourcePayload } from "./map-external-game-source-payload";
import { mapBaseNamed } from "./shared/mapper-utils";

describe("mapExternalGameSourcePayload", () => {
  it("should map external game source payloads", () => {
    expect(mapExternalGameSourcePayload({} as never)).toEqual({ base: "named" });
    expect(mapBaseNamed).toHaveBeenCalled();
  });
});
