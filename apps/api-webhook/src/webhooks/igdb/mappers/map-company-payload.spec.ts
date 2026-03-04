vi.mock("./shared/mapper-utils", () => ({
  mapBaseSlugged: vi.fn(() => ({ base: "slugged" })),
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readNumber: vi.fn(() => 44),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapCompanyPayload } from "./map-company-payload";
import { mapBaseSlugged, readDate, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapCompanyPayload", () => {
  it("should map company payloads", () => {
    const payload = {
      change_date_format: 1,
      changed_company: 2,
      company_size: 3,
      country: 4,
      description: "desc",
      logo: 5,
      parent: 6,
      start_date: 1_704_067_200,
      start_date_format: 7,
      status: 8,
    };

    expect(mapCompanyPayload(payload as never)).toEqual({
      base: "slugged",
      changeDateFormatId: "1-id",
      changedCompanyId: "2-id",
      companySizeId: "3-id",
      country: 44,
      description: "desc-text",
      logoId: "5-id",
      parentId: "6-id",
      startDate: new Date("2024-01-01T00:00:00.000Z"),
      startDateFormatId: "7-id",
      statusId: "8-id",
    });
    expect(mapBaseSlugged).toHaveBeenCalled();
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
    expect(readNumber).toHaveBeenCalledWith(4);
    expect(readString).toHaveBeenCalledWith("desc");
    expect(readOptionalId).toHaveBeenCalledTimes(7);
  });
});
