import { ExternalGameSource, GameStoreModel } from "@stakload/contracts/database/games";

const FETCH_GAME_METADATA_TIMEOUT_MS = 15_000;

export const fetchGameMetadata = async (baseUrl: string, gameId: string, source: ExternalGameSource) => {
  if (!baseUrl) {
    throw new Error("Stakload API base URL is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_GAME_METADATA_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/games/${gameId}?source=${source}`, {
      signal: controller.signal,
    });

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

    throw new Error(`Request failed with status ${response.status}${response.statusText ? `: ${response.statusText}` : ""}`);
  } finally {
    clearTimeout(timeout);
  }
};
