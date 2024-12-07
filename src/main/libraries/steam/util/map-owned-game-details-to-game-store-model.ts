import { InitialGameStoreModel, Library } from "@contracts/database/games";

import { removeSpecialChars } from "../../../util/remove-special-chars";
import { OwnedGameDetails } from "../types/owned-game";

export const mapOwnedGameDetailsToGameStoreModel = (
  ownedGameDetails: OwnedGameDetails,
  library: Library,
): InitialGameStoreModel => {
  const name = removeSpecialChars(ownedGameDetails.name);
  return {
    gameId: String(ownedGameDetails.appid),
    icon: ownedGameDetails.img_icon_url
      ? `http://media.steampowered.com/steamcommunity/public/images/apps/${ownedGameDetails.appid}/${ownedGameDetails.img_icon_url}.jpg`
      : undefined,
    library,
    name,
    sortableName: name,
  };
};
