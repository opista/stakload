vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 99),
  readIds: vi.fn(() => [1, 2]),
  readNumber: vi.fn(() => 2024),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapExternalGamePayload } from "./map-external-game-payload";
import { readDate, readIds, readId, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapExternalGamePayload", () => {
  it("should map external game payloads", () => {
    const payload = {
      checksum: "checksum",
      countries: [1, 2],
      external_game_source: 3,
      game: 4,
      game_release_format: 5,
      id: 99,
      name: "name",
      platform: 6,
      uid: "uid",
      updated_at: 1_704_067_200,
      url: "url",
      year: 2024,
    };

    expect(mapExternalGamePayload(payload as never)).toEqual({
      checksum: "checksum-text",
      countries: [1, 2],
      externalGameSource: "3-id",
      game: "4-id",
      gameReleaseFormat: "5-id",
      igdbId: 99,
      name: "name-text",
      platform: "6-id",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      uid: "uid-text",
      url: "url-text",
      year: 2024,
    });
    expect(readIds).toHaveBeenCalledWith([1, 2]);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
    expect(readId).toHaveBeenCalledWith(99);
    expect(readNumber).toHaveBeenCalledWith(2024);
    expect(readOptionalId).toHaveBeenCalledTimes(4);
    expect(readString).toHaveBeenCalledTimes(4);
  });
});
