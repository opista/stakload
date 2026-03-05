vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readDateOnly: vi.fn(() => "2024-01-01"),
  readId: vi.fn(() => 44),
  readNumber: vi.fn(() => 12),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapReleaseDatePayload } from "./map-release-date-payload";
import { readDate, readDateOnly, readId, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapReleaseDatePayload", () => {
  it("should map release date payloads", () => {
    const payload = {
      checksum: "checksum",
      date: "2024-01-01",
      date_format: 1,
      day: 2,
      game: 3,
      human: "January 1",
      id: 44,
      month: 4,
      platform: 5,
      release_region: 6,
      status: 7,
      updated_at: 1_704_067_200,
      year: 2024,
    };

    expect(mapReleaseDatePayload(payload as never)).toEqual({
      checksum: "checksum-text",
      date: "2024-01-01",
      dateFormatId: "1-id",
      day: 12,
      gameId: "3-id",
      human: "January 1-text",
      igdbId: 44,
      month: 12,
      platformId: "5-id",
      releaseRegionId: "6-id",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      statusId: "7-id",
      year: 12,
    });
    expect(readDateOnly).toHaveBeenCalledWith("2024-01-01");
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
    expect(readId).toHaveBeenCalledWith(44);
    expect(readNumber).toHaveBeenCalledTimes(3);
    expect(readOptionalId).toHaveBeenCalledTimes(5);
    expect(readString).toHaveBeenCalledTimes(2);
  });
});
