import { ExternalGameSource, GameStoreModel } from "@stakload/contracts/database/games";

export const fetchGameMetadata = async (baseUrl: string, gameId: string, source: ExternalGameSource) => {
  const response = await fetch(`${baseUrl}/games/${gameId}?source=${source}`);

  if (response.status === 200) {
    /**
     * TODO - revisit this. The API contract
     * should be shared. Move stakload-api into
     * this repo and convert to monorepo
     */
    const parsed: GameStoreModel = await response.json();

    return parsed;
  }

  if (response.status === 404) {
    return null;
  }

  throw new Error(response.statusText);
};
