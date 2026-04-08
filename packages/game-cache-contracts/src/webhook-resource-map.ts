import type { GameCacheReferenceKind } from "./reference-kinds";

const CACHE_AFFECTING_WEBHOOK_RESOURCE_TO_REFERENCE_KINDS = {
  age_rating_categories: ["ageRatingCategory"],
  age_rating_content_descriptions_v2: ["ageRatingContentDescription"],
  age_rating_organizations: ["ageRatingOrganisation"],
  age_ratings: ["ageRating"],
  alternative_names: ["alternativeName"],
  artworks: ["artwork"],
  collections: ["collection"],
  companies: ["company"],
  covers: ["cover"],
  external_game_sources: ["externalGameSource"],
  external_games: ["externalGame"],
  franchises: ["franchise"],
  game_engines: ["gameEngine"],
  game_modes: ["gameMode"],
  game_release_formats: ["gameReleaseFormat"],
  game_statuses: ["gameStatus"],
  game_types: ["gameType"],
  game_videos: ["gameVideo"],
  genres: ["genre"],
  involved_companies: ["involvedCompany"],
  keywords: ["keyword"],
  language_support_types: ["languageSupportType"],
  language_supports: ["languageSupport"],
  languages: ["language"],
  multiplayer_modes: ["multiplayerMode"],
  platforms: ["platform"],
  player_perspectives: ["playerPerspective"],
  screenshots: ["screenshot"],
  themes: ["theme"],
  websites: ["website"],
  website_types: ["websiteType"],
} as const satisfies Record<string, readonly GameCacheReferenceKind[]>;

export type CacheAffectingWebhookResource = keyof typeof CACHE_AFFECTING_WEBHOOK_RESOURCE_TO_REFERENCE_KINDS;

export const CACHE_AFFECTING_WEBHOOK_RESOURCES = Object.freeze(
  Object.keys(CACHE_AFFECTING_WEBHOOK_RESOURCE_TO_REFERENCE_KINDS) as CacheAffectingWebhookResource[],
);

export const getCacheReferenceKindsForWebhookResource = (resource: string): readonly GameCacheReferenceKind[] | null =>
  CACHE_AFFECTING_WEBHOOK_RESOURCE_TO_REFERENCE_KINDS[
    resource as keyof typeof CACHE_AFFECTING_WEBHOOK_RESOURCE_TO_REFERENCE_KINDS
  ] ?? null;
