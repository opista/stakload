import { IGDB_RESOURCE_DEFINITIONS, IGDB_RESOURCES } from "./generated/resources";

export { IGDB_RESOURCE_DEFINITIONS, IGDB_RESOURCES } from "./generated/resources";

export type IgdbResourceDefinition = (typeof IGDB_RESOURCE_DEFINITIONS)[number];
export type IgdbResourceName = IgdbResourceDefinition["resource"];

export type IgdbEntityRef = {
  id: number;
};

export type IgdbEntityBase = {
  checksum?: string | null;
  id: number;
};

export type IgdbRawEntity = IgdbEntityBase & Record<string, unknown>;

export type IgdbResourceRecordMap = {
  [resource in IgdbResourceName]: IgdbRawEntity;
};

export const IGDB_WEBHOOK_RESOURCES = IGDB_RESOURCES.filter((resource) => resource !== "search") as Exclude<
  IgdbResourceName,
  "search"
>[];

export const IGDB_PRIMARY_GAME_GRAPH_RESOURCES = [
  "age_rating_categories",
  "age_rating_content_descriptions_v2",
  "age_rating_organizations",
  "age_ratings",
  "alternative_names",
  "artworks",
  "collections",
  "companies",
  "company_logos",
  "company_websites",
  "covers",
  "external_game_sources",
  "external_games",
  "franchises",
  "game_engines",
  "game_localizations",
  "game_modes",
  "game_release_formats",
  "game_statuses",
  "game_types",
  "game_videos",
  "games",
  "genres",
  "involved_companies",
  "keywords",
  "language_support_types",
  "language_supports",
  "languages",
  "multiplayer_modes",
  "platform_families",
  "platform_logos",
  "platform_types",
  "platform_version_companies",
  "platform_version_release_dates",
  "platform_versions",
  "platform_websites",
  "platforms",
  "player_perspectives",
  "regions",
  "release_date_regions",
  "release_date_statuses",
  "release_dates",
  "screenshots",
  "themes",
  "website_types",
  "websites",
] as const satisfies readonly IgdbResourceName[];
