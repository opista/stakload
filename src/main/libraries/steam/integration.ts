import { getOwnedGames } from "./api";
import { isEmpty } from "lodash-es";
import { mapOwnedGameDetailsToGameStoreModel } from "./util/map-owned-game-details-to-game-store-model";
import { Library } from "@contracts/database/games";
import { findGamesByGameIds, bulkInsertGames } from "../../database/games";

const LIBRARY: Library = "steam";

export const isCredentialsValid = async (steamId: string, webApiKey: string) => {
  try {
    const response = await getOwnedGames(webApiKey, steamId);

    if (isEmpty(response)) return false;

    return true;
  } catch (err) {
    // TODO - error logging
    console.log(err);
    return false;
  }
};

export const findAndInsertNewGames = async (steamId: string, webApiKey: string) => {
  const response = await getOwnedGames(webApiKey, steamId);
  const games = response.games;

  const matches = await findGamesByGameIds(
    games.map(({ appid }) => String(appid)),
    LIBRARY,
  );
  const matchedIds = matches.map(({ gameId }) => gameId);

  const newGames = games
    .filter((game) => !matchedIds.includes(String(game.appid)))
    .map((game) => mapOwnedGameDetailsToGameStoreModel(game, LIBRARY));

  await bulkInsertGames(newGames);
};
