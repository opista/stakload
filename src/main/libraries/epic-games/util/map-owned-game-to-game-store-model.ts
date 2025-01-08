import { InitialGameStoreModel } from "@contracts/database/games";

import { mapSortableName } from "../../../util/map-sortable-name";
import { removeSpecialChars } from "../../../util/remove-special-chars";
import { OwnedGame } from "../types/owned-game";

export const mapOwnedGameToGameStoreModel = (game: OwnedGame): InitialGameStoreModel => {
  const name = removeSpecialChars(game.app_title);
  return {
    library: "epic-game-store",
    libraryMeta: {
      namespace: game.metadata.namespace,
    },
    name,
    sortableName: mapSortableName(name),
  };
};
