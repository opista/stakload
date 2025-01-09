import { GameStoreModel } from "@contracts/database/games";

import { AppDetails } from "../types/app-details";

export const mapAppDetailsToGameStoreModel = (appDetails: AppDetails): Partial<GameStoreModel> => ({
  backgroundImage: appDetails.background_raw,
  description: appDetails.detailed_description || appDetails.about_the_game || appDetails.short_description,
  listImage: appDetails.header_image,
  metadataSyncedAt: new Date(),
  type: appDetails.type,
});
