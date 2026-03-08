vi.mock("./shared/mapper-utils", () => ({
  readBoolean: vi.fn((value: unknown) => value === true),
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 12),
  readString: vi.fn(() => "checksum-text"),
}));

import { mapInvolvedCompanyPayload } from "./map-involved-company-payload";
import { readBoolean, readDate, readId, readString } from "./shared/mapper-utils";

describe("mapInvolvedCompanyPayload", () => {
  it("should map involved company payloads", () => {
    const payload = {
      checksum: "checksum",
      company: 1,
      developer: true,
      game: 2,
      id: 3,
      porting: false,
      publisher: true,
      supporting: false,
      updated_at: 1_704_067_200,
    };

    expect(mapInvolvedCompanyPayload(payload as never)).toEqual({
      checksum: "checksum-text",
      company: 12,
      developer: true,
      game: 12,
      igdbId: 12,
      porting: false,
      publisher: true,
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      supporting: false,
    });
    expect(readString).toHaveBeenCalledWith("checksum");
    expect(readBoolean).toHaveBeenCalledTimes(4);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
    expect(readId).toHaveBeenCalledTimes(3);
  });
});
