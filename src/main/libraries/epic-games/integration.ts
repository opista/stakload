import { bulkInsertGames, findGamesByEpicNamespace } from "../../database/games";
import { graphqlGetGameId } from "./api";
import { getOwnedGames } from "./legendary";
import { mapOwnedGameToGameStoreModel } from "./util/map-owned-game-to-game-store-model";

export const findAndInsertNewGames = async () => {
  const games = await getOwnedGames();

  const matches = await findGamesByEpicNamespace(games.map(({ metadata: { namespace } }) => namespace));
  const matchedIds = matches.map(({ libraryMeta }) => libraryMeta?.namespace);

  const newGames = games
    .filter((game) => !matchedIds.includes(game.metadata.namespace))
    .map((game) => mapOwnedGameToGameStoreModel(game));

  await bulkInsertGames(newGames);
};

export const getGameId = async (namespace: string) => {
  return graphqlGetGameId(namespace);
};
