vi.mock("./shared/mapper-utils", () => ({
  mapBaseImageAsset: vi.fn(() => ({ base: "image" })),
}));

import { mapCompanyLogoPayload } from "./map-company-logo-payload";
import { mapBaseImageAsset } from "./shared/mapper-utils";

describe("mapCompanyLogoPayload", () => {
  it("should map company logo payloads", () => {
    expect(mapCompanyLogoPayload({} as never)).toEqual({ base: "image" });
    expect(mapBaseImageAsset).toHaveBeenCalled();
  });
});
