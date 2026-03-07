vi.mock("./shared/mapper-utils", () => ({
  readIds: vi.fn((value: unknown) => (Array.isArray(value) ? value : [])),
}));

import { buildGameRelationRows } from "./build-game-relation-rows";
import { readIds } from "./shared/mapper-utils";

describe("buildGameRelationRows", () => {
  it("should build join-table rows from relation ids", () => {
    const payload = {
      collections: [1],
      franchises: [2],
      game_modes: [3],
      genres: [4],
      keywords: [5],
      platforms: [6],
      player_perspectives: [7],
      themes: [8],
    };

    expect(buildGameRelationRows(payload as never, 99)).toEqual({
      collections: [{ collection: 1, game: 99 }],
      franchises: [{ franchise: 2, game: 99 }],
      genres: [{ game: 99, genre: 4 }],
      keywords: [{ game: 99, keyword: 5 }],
      modes: [{ game: 99, gameMode: 3 }],
      platforms: [{ game: 99, platform: 6 }],
      playerPerspectives: [{ game: 99, playerPerspective: 7 }],
      themes: [{ game: 99, theme: 8 }],
    });
    expect(readIds).toHaveBeenCalledTimes(8);
  });
});
