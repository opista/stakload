import { GameStoreModel } from "@contracts/database/games";
import { mapSortableName } from "@util/map-sortable-name";
import { removeSpecialChars } from "@util/remove-special-chars";

import { OwnedGame } from "../../legendary/types";

export const mapOwnedGameToGameStoreModel = (game: OwnedGame): Partial<GameStoreModel> => {
  const name = removeSpecialChars(game.app_title);
  const sortableName = mapSortableName(name);
  return {
    library: "epic-game-store",
    libraryMeta: {
      appName: game.app_name,
      namespace: game.metadata.namespace,
    },
    name,
    sortableName,
  };
};
