import type { EntityManager } from "typeorm";

import {
  ArtworkEntity,
  CollectionEntity,
  CompanyEntity,
  CompanyLogoEntity,
  CompanyStatusEntity,
  CoverEntity,
  ExternalGameEntity,
  ExternalGameSourceEntity,
  FranchiseEntity,
  GameCollectionEntity,
  GameEntity,
  GameFranchiseEntity,
  GameGenreEntity,
  GameKeywordEntity,
  GameModeEntity,
  GameModeLookupEntity,
  GamePlatformEntity,
  GamePlayerPerspectiveEntity,
  GameThemeEntity,
  GenreEntity,
  InvolvedCompanyEntity,
  KeywordEntity,
  PlatformEntity,
  PlatformFamilyEntity,
  PlatformLogoEntity,
  PlatformTypeEntity,
  PlayerPerspectiveEntity,
  ReleaseDateEntity,
  ReleaseDateRegionEntity,
  ReleaseDateStatusEntity,
  ScreenshotEntity,
  ThemeEntity,
  WebsiteEntity,
  WebsiteTypeEntity,
} from "@stakload/database";

import {
  buildGameRelationRows,
  mapArtworkPayload,
  mapCollectionPayload,
  mapCompanyLogoPayload,
  mapCompanyPayload,
  mapCompanyStatusPayload,
  mapCoverPayload,
  mapExternalGamePayload,
  mapExternalGameSourcePayload,
  mapFranchisePayload,
  mapGameModePayload,
  mapGamePayload,
  mapGenrePayload,
  mapInvolvedCompanyPayload,
  mapKeywordPayload,
  mapPlatformFamilyPayload,
  mapPlatformLogoPayload,
  mapPlatformPayload,
  mapPlatformTypePayload,
  mapPlayerPerspectivePayload,
  mapReleaseDatePayload,
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
  await manager.delete(GameModeEntity, { gameId: rootId });
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
    await manager.insert(GameModeEntity, relations.modes);
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
    entity: ArtworkEntity,
    kind: "simple",
    map: mapArtworkPayload,
    resource: "artworks",
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
    entity: GameModeLookupEntity,
    kind: "simple",
    map: mapGameModePayload,
    resource: "game_modes",
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
    entity: ReleaseDateEntity,
    kind: "simple",
    map: mapReleaseDatePayload,
    resource: "release_dates",
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
