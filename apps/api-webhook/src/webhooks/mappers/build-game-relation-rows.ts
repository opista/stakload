import type {
  GameCollectionEntity,
  GameFranchiseEntity,
  GameGenreEntity,
  GameKeywordEntity,
  GameGameModeEntity,
  GamePlatformEntity,
  GamePlayerPerspectiveEntity,
  GameThemeEntity,
} from "@stakload/database";

import type { GameWebhookPayload } from "../types/igdb-webhook.types";
import { readIds } from "./shared/mapper-utils";

export const buildGameRelationRows = (
  payload: GameWebhookPayload,
  gameId: number,
): {
  collections: GameCollectionEntity[];
  franchises: GameFranchiseEntity[];
  genres: GameGenreEntity[];
  keywords: GameKeywordEntity[];
  modes: GameGameModeEntity[];
  platforms: GamePlatformEntity[];
  playerPerspectives: GamePlayerPerspectiveEntity[];
  themes: GameThemeEntity[];
} => ({
  collections: readIds(payload.collections).map((collectionId) => ({ collectionId, gameId })),
  franchises: readIds(payload.franchises).map((franchiseId) => ({ franchiseId, gameId })),
  genres: readIds(payload.genres).map((genreId) => ({ gameId, genreId })),
  keywords: readIds(payload.keywords).map((keywordId) => ({ gameId, keywordId })),
  modes: readIds(payload.game_modes).map((modeId) => ({ gameId, modeId })),
  platforms: readIds(payload.platforms).map((platformId) => ({ gameId, platformId })),
  playerPerspectives: readIds(payload.player_perspectives).map((playerPerspectiveId) => ({
    gameId,
    playerPerspectiveId,
  })),
  themes: readIds(payload.themes).map((themeId) => ({ gameId, themeId })),
});
