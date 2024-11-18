import { buildQueryParams } from "../../util/build-query-params";
import { AppDetailsResponse } from "./types/app-details";
import { AppReviewResponse } from "./types/app-review";
import { OwnedGamesResponse } from "./types/owned-game";

const STEAM_API_BASE_URL = "https://api.steampowered.com";
const STEAM_STORE_API_BASE_URL = "https://store.steampowered.com/api";

const request = async <T>(baseUrl: string, path: string, query?: Record<string, string>): Promise<T> => {
  const querystring = buildQueryParams(query);
  try {
    const response = await fetch(`${baseUrl}${path}${querystring}`, {
      method: "GET",
      headers: { accept: "application/json" },
    });

    return await response.json();
  } catch (err) {
    const message = "Request to Steam API failed";
    console.error(message, { err, path });
    throw new Error(message);
  }
};

const steamApiRequest = <T>(path: string, query?: Record<string, string>) =>
  request<T>(STEAM_API_BASE_URL, path, query);
const steamStoreApiRequest = <T>(path: string, query?: Record<string, string>) =>
  request<T>(STEAM_STORE_API_BASE_URL, path, query);

export const getOwnedGames = async (key: string, steamId: string) => {
  const result = await steamApiRequest<OwnedGamesResponse>("/IPlayerService/GetOwnedGames/v1", {
    key,
    include_appinfo: "true",
    include_played_free_games: "true",
    steamid: steamId,
  });

  return result.response;
};

export const getAppDetails = async (appId: string) => {
  const result = await steamStoreApiRequest<AppDetailsResponse>("/appdetails", {
    appids: appId,
    l: "english",
  });

  return result[appId].data;
};

export const getAppReviews = async (appId: number) => {
  return await steamStoreApiRequest<AppReviewResponse>(`/appreviews/${appId}`, {
    json: "1",
    purchase_type: "all",
    language: "all",
  });
};
