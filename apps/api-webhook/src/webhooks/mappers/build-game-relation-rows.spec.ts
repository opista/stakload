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
      collections: [{ collectionId: 1, gameId: 99 }],
      franchises: [{ franchiseId: 2, gameId: 99 }],
      genres: [{ gameId: 99, genreId: 4 }],
      keywords: [{ gameId: 99, keywordId: 5 }],
      modes: [{ gameId: 99, modeId: 3 }],
      platforms: [{ gameId: 99, platformId: 6 }],
      playerPerspectives: [{ gameId: 99, playerPerspectiveId: 7 }],
      themes: [{ gameId: 99, themeId: 8 }],
    });
    expect(readIds).toHaveBeenCalledTimes(8);
  });
});
