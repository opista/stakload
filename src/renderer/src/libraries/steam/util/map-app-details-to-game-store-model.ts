import { GameStoreModel, Platform } from "@database/schema/games";
import { AppDetails } from "../types/app-details";

const mapPlatform = (appDetails: AppDetails): Platform[] => {
  return [
    appDetails.platforms.linux && "linux",
    appDetails.platforms.mac && "mac",
    appDetails.platforms.windows && "windows",
  ].filter((val): val is Platform => Boolean(val));
};

export const mapAppDetailsToGameStoreModel = (appDetails: AppDetails): Partial<GameStoreModel> => ({
  backgroundImage: appDetails.background_raw,
  description: appDetails.detailed_description,
  listImage: appDetails.header_image,
  platform: mapPlatform(appDetails),
  type: appDetails.type,
});
