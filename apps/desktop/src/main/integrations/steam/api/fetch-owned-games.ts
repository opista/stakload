import { buildQueryParams } from "@util/build-query-params";

import { OwnedGameDetails, OwnedGamesResponse } from "./types";

const STEAM_API_BASE_URL = "https://api.steampowered.com";
const FETCH_OWNED_GAMES_TIMEOUT_MS = 15_000;

export const fetchOwnedGames = async (key: string, steamid: string): Promise<OwnedGameDetails[]> => {
  const query = buildQueryParams({
    include_appinfo: "true",
    include_played_free_games: "true",
    key,
    steamid,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_OWNED_GAMES_TIMEOUT_MS);

  try {
    const response = await fetch(`${STEAM_API_BASE_URL}/IPlayerService/GetOwnedGames/v1${query}`, {
      headers: { accept: "application/json" },
      method: "GET",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Steam API returned status ${response.status}${response.statusText ? `: ${response.statusText}` : ""}`);
    }

    const parsed: OwnedGamesResponse = await response.json();
    return parsed?.response?.games ?? [];
  } finally {
    clearTimeout(timeout);
  }
};
