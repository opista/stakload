import { GameStoreModel, Library } from "../../../database";
import { v4 as uuid } from "uuid";
import { OwnedGameDetails } from "../types/owned-game";
import { removeSpecialChars } from "../../../util/remove-special-chars";

export const mapOwnedGameDetailsToGameStoreModel = (
  ownedGameDetails: OwnedGameDetails,
  library: Library,
): GameStoreModel => ({
  id: uuid(),
  gameId: String(ownedGameDetails.appid),
  icon: ownedGameDetails.img_icon_url
    ? `http://media.steampowered.com/steamcommunity/public/images/apps/${ownedGameDetails.appid}/${ownedGameDetails.img_icon_url}.jpg`
    : "",
  library,
  metadataSyncedAt: 0,
  name: removeSpecialChars(ownedGameDetails.name),
});
