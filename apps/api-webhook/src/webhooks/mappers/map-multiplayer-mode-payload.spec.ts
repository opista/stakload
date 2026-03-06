vi.mock("./shared/mapper-utils", () => ({
  readBoolean: vi.fn(() => true),
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 79),
  readNumber: vi.fn(() => 9),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapMultiplayerModePayload } from "./map-multiplayer-mode-payload";
import { readBoolean, readDate, readId, readNumber, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapMultiplayerModePayload", () => {
  it("should map multiplayer mode payloads", () => {
    const payload = {
      campaigncoop: true,
      checksum: "sum",
      dropin: true,
      game: 2,
      id: 79,
      lancoop: true,
      offlinecoop: true,
      offlinecoopmax: 2,
      offlinemax: 4,
      onlinecoop: true,
      onlinecoopmax: 3,
      onlinemax: 8,
      platform: 9,
      splitscreen: true,
      splitscreenonline: true,
      updated_at: 1_704_067_200,
    };

    expect(mapMultiplayerModePayload(payload as never)).toEqual({
      campaignCoop: true,
      checksum: "sum-text",
      dropIn: true,
      gameId: "2-id",
      igdbId: 79,
      lanCoop: true,
      offlineCoop: true,
      offlineCoopMax: 9,
      offlineMax: 9,
      onlineCoop: true,
      onlineCoopMax: 9,
      onlineMax: 9,
      platformId: "9-id",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      splitScreen: true,
      splitScreenOnline: true,
    });
    expect(readBoolean).toHaveBeenCalledTimes(7);
    expect(readString).toHaveBeenCalledWith("sum");
    expect(readNumber).toHaveBeenCalledTimes(4);
    expect(readOptionalId).toHaveBeenCalledTimes(2);
    expect(readId).toHaveBeenCalledWith(79);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
  });
});
