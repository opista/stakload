import { GameStoreModel, LikeLibrary } from "@contracts/database/games";
import { Conf } from "electron-conf/main";

import { fetchGameMetadata } from "../../api/trulaunch";
import { LibraryActions } from "../../channels/game-sync-manager";
import { findGamesByGameIds } from "../../database/games";
import { buildQueryParams } from "../../util/build-query-params";
import { decryptString } from "../../util/safe-storage";
import { OwnedGamesResponse } from "./types/owned-game";
import { mapOwnedGameDetailsToGameStoreModel } from "./util/map-owned-game-details-to-game-store-model";

const LIBRARY: LikeLibrary = "steam";
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
    return parsed.response.games;
  } catch (err) {
    const message = "Request to Steam API failed";
    console.error(message, { err });
    throw new Error(message);
  }
};

const getGameMetadata = async (game: GameStoreModel) => {
  const metadata = await fetchGameMetadata(game.gameId!, LIBRARY);
  return metadata;
};

const getNewGames = async (conf: Conf) => {
  const config = conf.get("integration_settings.state.steamIntegration") as SteamIntegrationDetails;
  const webApiKey = decryptString(config.webApiKey);

  const games = await getOwnedGames(config.steamId, webApiKey);
  const matches = await findGamesByGameIds(
    games.map(({ appid }) => String(appid)),
    LIBRARY,
  );
  const matchedIds = matches.map(({ gameId }) => gameId);

  const newGames = games
    .filter((game) => !matchedIds.includes(String(game.appid)))
    .map((game) => mapOwnedGameDetailsToGameStoreModel(game));

  return newGames;
};

const steamLibrary: LibraryActions = {
  getGameMetadata,
  getLibraryInstallationStates: () => Promise.resolve(),
  getNewGames,
};

export default steamLibrary;
