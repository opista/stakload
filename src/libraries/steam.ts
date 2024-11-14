import { buildQueryParams } from "../util/build-query-params";
import { curl } from "../util/curl";
import { AppDetailsResponse } from "./steam/types/app-details";
import { AppReviewResponse } from "./steam/types/app-review";
import { OwnedGamesResponse } from "./steam/types/owned-game";

const STEAM_API_BASE_URL = "https://api.steampowered.com";
const STEAM_STORE_API_BASE_URL = "https://store.steampowered.com/api";

const apiRequest = async <T>(path: string): Promise<T> => {
  try {
    const response = await curl<string>(path, {
      method: "GET",
      headers: { accept: "application/json" },
    });

    return JSON.parse(response) as T;
  } catch (err) {
    const message = "Request to Steam API failed";
    console.error(message, { err, path });
    throw new Error(message);
  }
};

export const getOwnedGames = async (key: string, steamId: string) => {
  const query = buildQueryParams({
    key,
    include_appinfo: "true",
    include_played_free_games: "true",
    steamid: steamId,
  });
  const result = await apiRequest<OwnedGamesResponse>(
    `${STEAM_API_BASE_URL}/IPlayerService/GetOwnedGames/v1${query}`,
  );

  return result.response;
};

export const getAppDetails = async (appId: string) => {
  const query = buildQueryParams({ appids: appId, l: "english" });

  const result = await apiRequest<AppDetailsResponse>(
    `${STEAM_STORE_API_BASE_URL}/appdetails${query}`,
  );

  return result[appId].data;
};

export const getAppReviews = async (appId: number) => {
  const query = buildQueryParams({ json: "1", purchase_type: "all", language: "all" });

  const result = await apiRequest<AppReviewResponse>(
    `${STEAM_STORE_API_BASE_URL}/appreviews/${appId}${query}`,
  );

  return result;
};
