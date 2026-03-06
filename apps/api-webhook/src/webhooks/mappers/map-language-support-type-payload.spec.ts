vi.mock("./shared/mapper-utils", () => ({
  mapBaseNamed: vi.fn(() => ({ base: "named" })),
}));

import { mapLanguageSupportTypePayload } from "./map-language-support-type-payload";
import { mapBaseNamed } from "./shared/mapper-utils";

describe("mapLanguageSupportTypePayload", () => {
  it("should map language support type payloads", () => {
    expect(mapLanguageSupportTypePayload({} as never)).toEqual({ base: "named" });
    expect(mapBaseNamed).toHaveBeenCalled();
  });
});
