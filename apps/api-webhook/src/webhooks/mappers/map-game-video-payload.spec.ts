vi.mock("./shared/mapper-utils", () => ({
  readDate: vi.fn(() => new Date("2024-01-01T00:00:00.000Z")),
  readId: vi.fn(() => 78),
  readOptionalId: vi.fn((value: unknown) => `${String(value)}-id`),
  readString: vi.fn((value: unknown) => `${String(value)}-text`),
}));

import { mapGameVideoPayload } from "./map-game-video-payload";
import { readDate, readId, readOptionalId, readString } from "./shared/mapper-utils";

describe("mapGameVideoPayload", () => {
  it("should map game video payloads", () => {
    const payload = { checksum: "sum", game: 5, id: 78, name: "Trailer", updated_at: 1_704_067_200, video_id: "abc" };

    expect(mapGameVideoPayload(payload as never)).toEqual({
      checksum: "sum-text",
      game: "5-id",
      igdbId: 78,
      name: "Trailer-text",
      sourceUpdatedAt: new Date("2024-01-01T00:00:00.000Z"),
      videoId: "abc-text",
    });
    expect(readString).toHaveBeenCalledTimes(3);
    expect(readOptionalId).toHaveBeenCalledWith(5);
    expect(readId).toHaveBeenCalledWith(78);
    expect(readDate).toHaveBeenCalledWith(1_704_067_200);
  });
});
