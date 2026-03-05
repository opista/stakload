vi.mock("./shared/mapper-utils", () => ({
  mapBaseNamed: vi.fn(() => ({ base: "named" })),
}));

import { mapCompanyStatusPayload } from "./map-company-status-payload";
import { mapBaseNamed } from "./shared/mapper-utils";

describe("mapCompanyStatusPayload", () => {
  it("should map company status payloads", () => {
    expect(mapCompanyStatusPayload({} as never)).toEqual({ base: "named" });
    expect(mapBaseNamed).toHaveBeenCalled();
  });
});
