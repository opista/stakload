import { buildQueryParams } from "@util/build-query-params";

import { OwnedGameDetails, OwnedGamesResponse } from "./types";

const STEAM_API_BASE_URL = "https://api.steampowered.com";

export const fetchOwnedGames = async (key: string, steamid: string): Promise<OwnedGameDetails[]> => {
  const query = buildQueryParams({
    include_appinfo: "true",
    include_played_free_games: "true",
    key,
    steamid,
  });
  const response = await fetch(`${STEAM_API_BASE_URL}/IPlayerService/GetOwnedGames/v1${query}`, {
    headers: { accept: "application/json" },
    method: "GET",
  });

  const parsed: OwnedGamesResponse = await response.json();
  return parsed?.response?.games ?? [];
};
