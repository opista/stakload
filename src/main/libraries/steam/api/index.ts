import { buildQueryParams } from "../../../util/build-query-params";
import { OwnedGamesResponse } from "./types";

const STEAM_API_BASE_URL = "https://api.steampowered.com";

export const getOwnedGames = async (steamId: string, webApiKey: string) => {
  const query = buildQueryParams({
    include_appinfo: "true",
    include_played_free_games: "true",
    key: webApiKey,
    steamid: steamId,
  });

  try {
    const response = await fetch(`${STEAM_API_BASE_URL}/IPlayerService/GetOwnedGames/v1${query}`, {
      headers: { accept: "application/json" },
      method: "GET",
    });

    const parsed: OwnedGamesResponse = await response.json();
    return parsed?.response?.games;
  } catch (err) {
    const message = "Request to Steam API failed";
    console.error(message, { err });
    throw new Error(message);
  }
};
