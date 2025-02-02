import { GameStoreModel } from "@contracts/database/games";

import { mapSortableName } from "../../../util/map-sortable-name";
import { removeSpecialChars } from "../../../util/remove-special-chars";
import { OwnedGameDetails } from "../api/types";

export const mapOwnedGameDetailsToGameStoreModel = (ownedGameDetails: OwnedGameDetails): Partial<GameStoreModel> => {
  const name = removeSpecialChars(ownedGameDetails.name);
  const sortableName = mapSortableName(name);
  return {
    gameId: String(ownedGameDetails.appid),
    library: "steam",
    name,
    sortableName,
  };
};
