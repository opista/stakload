import { v4 as uuid } from "uuid";
import { OwnedGameDetails } from "../types/owned-game";
import { InitialGameStoreModel, Library } from "../../../database/games";
import { removeSpecialChars } from "../../../util/remove-special-chars";

export const mapOwnedGameDetailsToGameStoreModel = (
  ownedGameDetails: OwnedGameDetails,
  library: Library,
): InitialGameStoreModel => ({
  gameId: String(ownedGameDetails.appid),
  icon: ownedGameDetails.img_icon_url
    ? `http://media.steampowered.com/steamcommunity/public/images/apps/${ownedGameDetails.appid}/${ownedGameDetails.img_icon_url}.jpg`
    : undefined,
  id: uuid(),
  library,
  name: removeSpecialChars(ownedGameDetails.name),
});
