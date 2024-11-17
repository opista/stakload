import { GameStoreModel, Platform } from "@database/schema/games";
import { AppDetails } from "../types/app-details";

const mapPlatform = (appDetails: AppDetails): Platform[] => {
  return [
    appDetails.platforms.linux && "linux",
    appDetails.platforms.mac && "mac",
    appDetails.platforms.windows && "windows",
  ].filter((val): val is Platform => Boolean(val));
};

export const mapAppDetailsToGameStoreModel = (game: GameStoreModel, appDetails: AppDetails): GameStoreModel => ({
  ...game,
  backgroundImage: appDetails.background_raw,
  listImage: appDetails.header_image,
  platform: mapPlatform(appDetails),
  type: appDetails.type,
});
