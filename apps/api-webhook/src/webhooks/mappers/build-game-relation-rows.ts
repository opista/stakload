import type {
  GameCollectionLinkEntity,
  GameFranchiseLinkEntity,
  GameGenreLinkEntity,
  GameKeywordLinkEntity,
  GameGameModeLinkEntity,
  GamePlatformLinkEntity,
  GamePlayerPerspectiveLinkEntity,
  GameThemeLinkEntity,
} from "@stakload/database";

import type { GameWebhookPayload } from "../types/igdb-webhook.types";
import { readIds } from "./shared/mapper-utils";

export const buildGameRelationRows = (
  payload: GameWebhookPayload,
  game: number,
): {
  collections: GameCollectionLinkEntity[];
  franchises: GameFranchiseLinkEntity[];
  genres: GameGenreLinkEntity[];
  keywords: GameKeywordLinkEntity[];
  modes: GameGameModeLinkEntity[];
  platforms: GamePlatformLinkEntity[];
  playerPerspectives: GamePlayerPerspectiveLinkEntity[];
  themes: GameThemeLinkEntity[];
} => ({
  collections: readIds(payload.collections).map((collection) => ({ collection, game })),
  franchises: readIds(payload.franchises).map((franchise) => ({ franchise, game })),
  genres: readIds(payload.genres).map((genre) => ({ game, genre })),
  keywords: readIds(payload.keywords).map((keyword) => ({ game, keyword })),
  modes: readIds(payload.game_modes).map((gameMode) => ({ game, gameMode })),
  platforms: readIds(payload.platforms).map((platform) => ({ game, platform })),
  playerPerspectives: readIds(payload.player_perspectives).map((playerPerspective) => ({
    game,
    playerPerspective,
  })),
  themes: readIds(payload.themes).map((theme) => ({ game, theme })),
});
