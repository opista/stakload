import { buildQueryParams } from "../util/build-query-params";
import { curl } from "../util/curl";

const STEAM_API_BASE_URL = "https://api.steampowered.com";

type GetOwnedGamesGame = {
  appid: number;
  content_descriptorids: number[];
  has_community_visible_stats: boolean;
  img_icon_url: string;
  name: string;
  playtime_deck_forever: number;
  playtime_disconnected: number;
  playtime_forever: number;
  playtime_linux_forever: number;
  playtime_mac_forever: number;
  playtime_windows_forever: number;
  rtime_last_played: number;
};

type GetOwnedGamesResponse = {
  response: {
    game_count: number;
    games: GetOwnedGamesGame[];
  };
};

const steamApiRequest = async <T extends any>(
  path: string,
  apiKey: string,
  params?: Record<string, string | number | boolean>
): Promise<T> => {
  const query = buildQueryParams({ key: apiKey, ...params });

  try {
    const response = await curl<string>(
      `${STEAM_API_BASE_URL}/${path}${query}`,
      {
        method: "GET",
        headers: { accept: "application/json" },
      }
    );

    return JSON.parse(response);
  } catch (err) {
    const message = "Request to Steam API failed";
    console.error(message, { err, path, params });
    throw new Error(message);
  }
};

export const getOwnedGames = async (apiKey: string, steamId: string) => {
  const query = {
    include_appinfo: "true",
    include_played_free_games: "true",
    steamid: steamId,
  };

  const result = await steamApiRequest<GetOwnedGamesResponse>(
    "/IPlayerService/GetOwnedGames/v1",
    apiKey,
    query
  );

  return result.response;
};
