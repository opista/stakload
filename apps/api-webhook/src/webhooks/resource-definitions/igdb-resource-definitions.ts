import type { EntityManager } from "typeorm";

import {
  AgeRatingCategoryEntity,
  AgeRatingContentDescriptionV2Entity,
  AgeRatingOrganizationEntity,
  AgeRatingEntity,
  AlternativeNameEntity,
  ArtworkEntity,
  ArtworkTypeEntity,
  CollectionEntity,
  CompanyEntity,
  CompanyLogoEntity,
  CompanyStatusEntity,
  CoverEntity,
  DateFormatEntity,
  ExternalGameEntity,
  ExternalGameSourceEntity,
  FranchiseEntity,
  GameCollectionEntity,
  GameEngineEntity,
  GameEngineLogoEntity,
  GameEntity,
  GameFranchiseEntity,
  GameGenreEntity,
  GameKeywordEntity,
  GameModeEntity,
  GameGameModeEntity,
  GameReleaseFormatEntity,
  GameStatusEntity,
  GamePlatformEntity,
  GamePlayerPerspectiveEntity,
  GameThemeEntity,
  GameTypeEntity,
  GameVideoEntity,
  GenreEntity,
  InvolvedCompanyEntity,
  KeywordEntity,
  LanguageEntity,
  LanguageSupportEntity,
  LanguageSupportTypeEntity,
  MultiplayerModeEntity,
  PlatformEntity,
  PlatformFamilyEntity,
  PlatformLogoEntity,
  PlatformTypeEntity,
  PlayerPerspectiveEntity,
  ReleaseDateRegionEntity,
  ReleaseDateStatusEntity,
  ScreenshotEntity,
  ThemeEntity,
  WebsiteEntity,
  WebsiteTypeEntity,
} from "@stakload/database";

import {
  buildGameRelationRows,
  mapAgeRatingCategoryPayload,
  mapAgeRatingContentDescriptionV2Payload,
  mapAgeRatingOrganizationPayload,
  mapAgeRatingPayload,
  mapAlternativeNamePayload,
  mapArtworkPayload,
  mapArtworkTypePayload,
  mapCollectionPayload,
  mapCompanyLogoPayload,
  mapCompanyPayload,
  mapCompanyStatusPayload,
  mapCoverPayload,
  mapDateFormatPayload,
  mapExternalGamePayload,
  mapExternalGameSourcePayload,
  mapFranchisePayload,
  mapGameEngineLogoPayload,
  mapGameEnginePayload,
  mapGameModePayload,
  mapGameReleaseFormatPayload,
  mapGameStatusPayload,
  mapGamePayload,
  mapGameTypePayload,
  mapGameVideoPayload,
  mapGenrePayload,
  mapInvolvedCompanyPayload,
  mapKeywordPayload,
  mapLanguagePayload,
  mapLanguageSupportPayload,
  mapLanguageSupportTypePayload,
  mapMultiplayerModePayload,
  mapPlatformFamilyPayload,
  mapPlatformLogoPayload,
  mapPlatformPayload,
  mapPlatformTypePayload,
  mapPlayerPerspectivePayload,
  mapReleaseDateRegionPayload,
  mapReleaseDateStatusPayload,
  mapScreenshotPayload,
  mapThemePayload,
  mapWebsitePayload,
  mapWebsiteTypePayload,
} from "../mappers";
import type {
  AggregateResourceDefinition,
  GameWebhookPayload,
  ResourceDefinition,
  SimpleResourceDefinition,
  WebhookResource,
} from "../types/igdb-webhook.types";

const replaceGameRelations = async (
  manager: EntityManager,
  payload: GameWebhookPayload,
  rootId: number,
): Promise<void> => {
  const relations = buildGameRelationRows(payload, rootId);

  await manager.delete(GameCollectionEntity, { gameId: rootId });
  await manager.delete(GameFranchiseEntity, { gameId: rootId });
  await manager.delete(GameGenreEntity, { gameId: rootId });
  await manager.delete(GameKeywordEntity, { gameId: rootId });
  await manager.delete(GameGameModeEntity, { gameId: rootId });
  await manager.delete(GamePlatformEntity, { gameId: rootId });
  await manager.delete(GamePlayerPerspectiveEntity, { gameId: rootId });
  await manager.delete(GameThemeEntity, { gameId: rootId });

  if (relations.collections.length > 0) {
    await manager.insert(GameCollectionEntity, relations.collections);
  }

  if (relations.franchises.length > 0) {
    await manager.insert(GameFranchiseEntity, relations.franchises);
  }

  if (relations.genres.length > 0) {
    await manager.insert(GameGenreEntity, relations.genres);
  }

  if (relations.keywords.length > 0) {
    await manager.insert(GameKeywordEntity, relations.keywords);
  }

  if (relations.modes.length > 0) {
    await manager.insert(GameGameModeEntity, relations.modes);
  }

  if (relations.platforms.length > 0) {
    await manager.insert(GamePlatformEntity, relations.platforms);
  }

  if (relations.playerPerspectives.length > 0) {
    await manager.insert(GamePlayerPerspectiveEntity, relations.playerPerspectives);
  }

  if (relations.themes.length > 0) {
    await manager.insert(GameThemeEntity, relations.themes);
  }
};

const simpleDefinitions = [
  {
    entity: AgeRatingCategoryEntity,
    kind: "simple",
    map: mapAgeRatingCategoryPayload,
    resource: "age_rating_categories",
    staleProtection: "best_effort",
  },
  {
    entity: AgeRatingContentDescriptionV2Entity,
    kind: "simple",
    map: mapAgeRatingContentDescriptionV2Payload,
    resource: "age_rating_content_descriptions_v2",
    staleProtection: "best_effort",
  },
  {
    entity: AgeRatingOrganizationEntity,
    kind: "simple",
    map: mapAgeRatingOrganizationPayload,
    resource: "age_rating_organizations",
    staleProtection: "best_effort",
  },
  {
    entity: AgeRatingEntity,
    kind: "simple",
    map: mapAgeRatingPayload,
    resource: "age_ratings",
    staleProtection: "best_effort",
  },
  {
    entity: AlternativeNameEntity,
    kind: "simple",
    map: mapAlternativeNamePayload,
    resource: "alternative_names",
    staleProtection: "best_effort",
  },
  {
    entity: ArtworkEntity,
    kind: "simple",
    map: mapArtworkPayload,
    resource: "artworks",
    staleProtection: "best_effort",
  },
  {
    entity: ArtworkTypeEntity,
    kind: "simple",
    map: mapArtworkTypePayload,
    resource: "artwork_types",
    staleProtection: "best_effort",
  },
  {
    entity: CollectionEntity,
    kind: "simple",
    map: mapCollectionPayload,
    resource: "collections",
    staleProtection: "best_effort",
  },
  {
    entity: CompanyEntity,
    kind: "simple",
    map: mapCompanyPayload,
    resource: "companies",
    staleProtection: "best_effort",
  },
  {
    entity: CompanyLogoEntity,
    kind: "simple",
    map: mapCompanyLogoPayload,
    resource: "company_logos",
    staleProtection: "best_effort",
  },
  {
    entity: CompanyStatusEntity,
    kind: "simple",
    map: mapCompanyStatusPayload,
    resource: "company_statuses",
    staleProtection: "best_effort",
  },
  { entity: CoverEntity, kind: "simple", map: mapCoverPayload, resource: "covers", staleProtection: "best_effort" },
  {
    entity: DateFormatEntity,
    kind: "simple",
    map: mapDateFormatPayload,
    resource: "date_formats",
    staleProtection: "best_effort",
  },
  {
    entity: ExternalGameEntity,
    kind: "simple",
    map: mapExternalGamePayload,
    resource: "external_games",
    staleProtection: "best_effort",
  },
  {
    entity: ExternalGameSourceEntity,
    kind: "simple",
    map: mapExternalGameSourcePayload,
    resource: "external_game_sources",
    staleProtection: "best_effort",
  },
  {
    entity: FranchiseEntity,
    kind: "simple",
    map: mapFranchisePayload,
    resource: "franchises",
    staleProtection: "best_effort",
  },
  {
    entity: GameEngineLogoEntity,
    kind: "simple",
    map: mapGameEngineLogoPayload,
    resource: "game_engine_logos",
    staleProtection: "best_effort",
  },
  {
    entity: GameEngineEntity,
    kind: "simple",
    map: mapGameEnginePayload,
    resource: "game_engines",
    staleProtection: "best_effort",
  },
  {
    entity: GameModeEntity,
    kind: "simple",
    map: mapGameModePayload,
    resource: "game_modes",
    staleProtection: "best_effort",
  },
  {
    entity: GameReleaseFormatEntity,
    kind: "simple",
    map: mapGameReleaseFormatPayload,
    resource: "game_release_formats",
    staleProtection: "best_effort",
  },
  {
    entity: GameStatusEntity,
    kind: "simple",
    map: mapGameStatusPayload,
    resource: "game_statuses",
    staleProtection: "best_effort",
  },
  {
    entity: GameTypeEntity,
    kind: "simple",
    map: mapGameTypePayload,
    resource: "game_types",
    staleProtection: "best_effort",
  },
  {
    entity: GameVideoEntity,
    kind: "simple",
    map: mapGameVideoPayload,
    resource: "game_videos",
    staleProtection: "best_effort",
  },
  { entity: GenreEntity, kind: "simple", map: mapGenrePayload, resource: "genres", staleProtection: "best_effort" },
  {
    entity: InvolvedCompanyEntity,
    kind: "simple",
    map: mapInvolvedCompanyPayload,
    resource: "involved_companies",
    staleProtection: "best_effort",
  },
  {
    entity: KeywordEntity,
    kind: "simple",
    map: mapKeywordPayload,
    resource: "keywords",
    staleProtection: "best_effort",
  },
  {
    entity: LanguageEntity,
    kind: "simple",
    map: mapLanguagePayload,
    resource: "languages",
    staleProtection: "best_effort",
  },
  {
    entity: LanguageSupportTypeEntity,
    kind: "simple",
    map: mapLanguageSupportTypePayload,
    resource: "language_support_types",
    staleProtection: "best_effort",
  },
  {
    entity: LanguageSupportEntity,
    kind: "simple",
    map: mapLanguageSupportPayload,
    resource: "language_supports",
    staleProtection: "best_effort",
  },
  {
    entity: MultiplayerModeEntity,
    kind: "simple",
    map: mapMultiplayerModePayload,
    resource: "multiplayer_modes",
    staleProtection: "best_effort",
  },
  {
    entity: PlatformEntity,
    kind: "simple",
    map: mapPlatformPayload,
    resource: "platforms",
    staleProtection: "best_effort",
  },
  {
    entity: PlatformFamilyEntity,
    kind: "simple",
    map: mapPlatformFamilyPayload,
    resource: "platform_families",
    staleProtection: "best_effort",
  },
  {
    entity: PlatformLogoEntity,
    kind: "simple",
    map: mapPlatformLogoPayload,
    resource: "platform_logos",
    staleProtection: "best_effort",
  },
  {
    entity: PlatformTypeEntity,
    kind: "simple",
    map: mapPlatformTypePayload,
    resource: "platform_types",
    staleProtection: "best_effort",
  },
  {
    entity: PlayerPerspectiveEntity,
    kind: "simple",
    map: mapPlayerPerspectivePayload,
    resource: "player_perspectives",
    staleProtection: "best_effort",
  },
  {
    entity: ReleaseDateRegionEntity,
    kind: "simple",
    map: mapReleaseDateRegionPayload,
    resource: "release_date_regions",
    staleProtection: "best_effort",
  },
  {
    entity: ReleaseDateStatusEntity,
    kind: "simple",
    map: mapReleaseDateStatusPayload,
    resource: "release_date_statuses",
    staleProtection: "best_effort",
  },
  {
    entity: ScreenshotEntity,
    kind: "simple",
    map: mapScreenshotPayload,
    resource: "screenshots",
    staleProtection: "best_effort",
  },
  { entity: ThemeEntity, kind: "simple", map: mapThemePayload, resource: "themes", staleProtection: "best_effort" },
  {
    entity: WebsiteEntity,
    kind: "simple",
    map: mapWebsitePayload,
    resource: "websites",
    staleProtection: "best_effort",
  },
  {
    entity: WebsiteTypeEntity,
    kind: "simple",
    map: mapWebsiteTypePayload,
    resource: "website_types",
    staleProtection: "best_effort",
  },
] satisfies SimpleResourceDefinition[];

const aggregateDefinitions = [
  {
    entity: GameEntity,
    kind: "aggregate",
    map: mapGamePayload,
    replaceRelations: async ({ manager, payload, rootId }) => replaceGameRelations(manager, payload, rootId),
    resource: "games",
    staleProtection: "stale_protected",
  },
] satisfies AggregateResourceDefinition<GameWebhookPayload, GameEntity>[];

export const SUPPORTED_RESOURCE_DEFINITIONS: readonly ResourceDefinition[] = [
  ...simpleDefinitions,
  ...aggregateDefinitions,
];
export const RESOURCE_DEFINITION_MAP: ReadonlyMap<WebhookResource, ResourceDefinition> = new Map(
  SUPPORTED_RESOURCE_DEFINITIONS.map((definition): [WebhookResource, ResourceDefinition] => [
    definition.resource,
    definition,
  ]),
);

export const SUPPORTED_WEBHOOK_RESOURCES = Object.freeze([...RESOURCE_DEFINITION_MAP.keys()]);

