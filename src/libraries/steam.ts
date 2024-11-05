import { buildQueryParams } from "../util/build-query-params";

const STEAM_API_BASE_URL = "https://api.steampowered.com";

const steamApiRequest = async (
  path: string,
  apiKey: string,
  params?: Record<string, string | number | boolean>
) => {
  const query = buildQueryParams({ key: apiKey, ...params });

  try {
    const response = await fetch(`${STEAM_API_BASE_URL}/${path}${query}`);
    return await response.json();
  } catch (err) {
    const message = "Request to Steam API failed";
    console.error(message, { path, params });
    throw new Error(message);
  }
};

export const getOwnedGames = (apiKey: string, steamId: string) => {
  return steamApiRequest("IPlayerService/GetOwnedGames/v1", apiKey, {
    include_appinfo: true,
    include_played_free_games: true,
    steamid: steamId,
  });
};
