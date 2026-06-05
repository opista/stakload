import { GameMetadata, GameMetadataSource } from "@stakload/contracts/database/games";

const FETCH_GAMES_METADATA_TIMEOUT_MS = 15_000;

export const fetchGamesMetadata = async (
  baseUrl: string,
  source: GameMetadataSource,
  externalGameIds: string[],
) => {
  if (!baseUrl) {
    throw new Error("Stakload API base URL is not configured");
  }

  if (!externalGameIds.length) {
    return [];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_GAMES_METADATA_TIMEOUT_MS);
  const url = new URL("games", baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  url.searchParams.set("source", source);

  for (const externalGameId of externalGameIds) {
    url.searchParams.append("externalGameId", externalGameId);
  }

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (response.status === 200) {
      return (await response.json()) as GameMetadata[];
    }

    throw new Error(`Request failed with status ${response.status}${response.statusText ? `: ${response.statusText}` : ""}`);
  } finally {
    clearTimeout(timeout);
  }
};
