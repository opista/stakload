vi.mock("./shared/mapper-utils", () => ({
  readBoolean: vi.fn(() => true),
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 73),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapCompanyWebsitePayload } from "./map-company-website-payload";
import { readBoolean, readDate, readId, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapCompanyWebsitePayload", () => {
  it("should map company website payloads", () => {
    const payload = { checksum: "sum", id: 73, trusted: true, type: 5, updated_at: 1_704_067_200, url: "url" };

    expect(mapCompanyWebsitePayload(payload as never)).toEqual({
      checksum: "sum-text",
      igdbId: 73,
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      trusted: true,
      typeId: "5-id",
      url: "url-text",
    });
    expect(readString).toHaveBeenCalledTimes(2);
    expect(readId).toHaveBeenCalledWith(73);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
    expect(readBoolean).toHaveBeenCalledWith(true);
    expect(readOptionalId).toHaveBeenCalledWith(5);
  });
});
