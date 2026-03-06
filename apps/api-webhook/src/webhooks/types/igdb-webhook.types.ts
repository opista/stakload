import type { EntityManager, EntityTarget, ObjectLiteral } from "typeorm";

import { IGDB_RESOURCES } from "@stakload/igdb-vendor";
import type {
  AgeRating,
  AgeRatingCategory,
  AgeRatingContentDescriptionV2,
  AgeRatingOrganization,
  AlternativeName,
  Artwork,
  ArtworkType,
  Collection,
  Company,
  CompanyLogo,
  CompanyStatus,
  CompanyWebsite,
  Cover,
  DateFormat,
  ExternalGame,
  ExternalGameSource,
  Franchise,
  Game,
  GameEngine,
  GameEngineLogo,
  GameMode,
  GameReleaseFormat,
  GameStatus,
  GameType,
  GameVideo,
  Genre,
  InvolvedCompany,
  Keyword,
  Language,
  LanguageSupport,
  LanguageSupportType,
  MultiplayerMode,
  Platform,
  PlatformFamily,
  PlatformLogo,
  PlatformType,
  PlayerPerspective,
  ReleaseDate,
  ReleaseDateRegion,
  ReleaseDateStatus,
  Screenshot,
  Theme,
  Website,
  WebsiteType,
} from "@stakload/igdb-vendor";

export const WEBHOOK_ACTIONS = ["create", "delete", "update"] as const;
export const WEBHOOK_ACTION_SET = new Set<string>(WEBHOOK_ACTIONS);
export const WEBHOOK_RESOURCE_SET = new Set<string>(IGDB_RESOURCES);

export type WebhookAction = (typeof WEBHOOK_ACTIONS)[number];
export type WebhookResource = (typeof IGDB_RESOURCES)[number];

export type WebhookOutcome = "handled" | "ignored_tombstoned" | "ignored_unsupported" | "rejected_stale";

export type StaleProtectionMode = "best_effort" | "delete_only_tombstone_protected" | "stale_protected";

export type IgdbWebhookPayload<TPayload extends object> = TPayload & Record<string, unknown>;

export type AgeRatingWebhookPayload = IgdbWebhookPayload<AgeRating>;
export type AgeRatingCategoryWebhookPayload = IgdbWebhookPayload<AgeRatingCategory>;
export type AgeRatingContentDescriptionV2WebhookPayload = IgdbWebhookPayload<AgeRatingContentDescriptionV2>;
export type AgeRatingOrganizationWebhookPayload = IgdbWebhookPayload<AgeRatingOrganization>;
export type AlternativeNameWebhookPayload = IgdbWebhookPayload<AlternativeName>;
export type ArtworkWebhookPayload = IgdbWebhookPayload<Artwork>;
export type ArtworkTypeWebhookPayload = IgdbWebhookPayload<ArtworkType>;
export type CollectionWebhookPayload = IgdbWebhookPayload<Collection>;
export type CompanyLogoWebhookPayload = IgdbWebhookPayload<CompanyLogo>;
export type CompanyStatusWebhookPayload = IgdbWebhookPayload<CompanyStatus>;
export type CompanyWebsiteWebhookPayload = IgdbWebhookPayload<CompanyWebsite>;
export type CompanyWebhookPayload = IgdbWebhookPayload<Company>;
export type CoverWebhookPayload = IgdbWebhookPayload<Cover>;
export type DateFormatWebhookPayload = IgdbWebhookPayload<DateFormat>;
export type ExternalGameSourceWebhookPayload = IgdbWebhookPayload<ExternalGameSource>;
export type ExternalGameWebhookPayload = IgdbWebhookPayload<ExternalGame>;
export type FranchiseWebhookPayload = IgdbWebhookPayload<Franchise>;
export type GameModeWebhookPayload = IgdbWebhookPayload<GameMode>;
export type GameReleaseFormatWebhookPayload = IgdbWebhookPayload<GameReleaseFormat>;
export type GameStatusWebhookPayload = IgdbWebhookPayload<GameStatus>;
export type GameTypeWebhookPayload = IgdbWebhookPayload<GameType>;
export type GameVideoWebhookPayload = IgdbWebhookPayload<GameVideo>;
export type GameWebhookPayload = IgdbWebhookPayload<Game>;
export type GameEngineLogoWebhookPayload = IgdbWebhookPayload<GameEngineLogo>;
export type GameEngineWebhookPayload = IgdbWebhookPayload<GameEngine>;
export type GenreWebhookPayload = IgdbWebhookPayload<Genre>;
export type InvolvedCompanyWebhookPayload = IgdbWebhookPayload<InvolvedCompany>;
export type KeywordWebhookPayload = IgdbWebhookPayload<Keyword>;
export type LanguageWebhookPayload = IgdbWebhookPayload<Language>;
export type LanguageSupportWebhookPayload = IgdbWebhookPayload<LanguageSupport>;
export type LanguageSupportTypeWebhookPayload = IgdbWebhookPayload<LanguageSupportType>;
export type MultiplayerModeWebhookPayload = IgdbWebhookPayload<MultiplayerMode>;
export type PlatformFamilyWebhookPayload = IgdbWebhookPayload<PlatformFamily>;
export type PlatformLogoWebhookPayload = IgdbWebhookPayload<PlatformLogo>;
export type PlatformTypeWebhookPayload = IgdbWebhookPayload<PlatformType>;
export type PlatformWebhookPayload = IgdbWebhookPayload<Platform>;
export type PlayerPerspectiveWebhookPayload = IgdbWebhookPayload<PlayerPerspective>;
export type ReleaseDateRegionWebhookPayload = IgdbWebhookPayload<ReleaseDateRegion>;
export type ReleaseDateWebhookPayload = IgdbWebhookPayload<ReleaseDate>;
export type ReleaseDateStatusWebhookPayload = IgdbWebhookPayload<ReleaseDateStatus>;
export type ScreenshotWebhookPayload = IgdbWebhookPayload<Screenshot>;
export type ThemeWebhookPayload = IgdbWebhookPayload<Theme>;
export type WebsiteTypeWebhookPayload = IgdbWebhookPayload<WebsiteType>;
export type WebsiteWebhookPayload = IgdbWebhookPayload<Website>;

export type RawIgdbPayload =
  | AgeRatingWebhookPayload
  | AgeRatingCategoryWebhookPayload
  | AgeRatingContentDescriptionV2WebhookPayload
  | AgeRatingOrganizationWebhookPayload
  | AlternativeNameWebhookPayload
  | ArtworkWebhookPayload
  | ArtworkTypeWebhookPayload
  | CollectionWebhookPayload
  | CompanyLogoWebhookPayload
  | CompanyStatusWebhookPayload
  | CompanyWebsiteWebhookPayload
  | CompanyWebhookPayload
  | CoverWebhookPayload
  | DateFormatWebhookPayload
  | ExternalGameSourceWebhookPayload
  | ExternalGameWebhookPayload
  | FranchiseWebhookPayload
  | GameModeWebhookPayload
  | GameReleaseFormatWebhookPayload
  | GameStatusWebhookPayload
  | GameTypeWebhookPayload
  | GameVideoWebhookPayload
  | GameWebhookPayload
  | GameEngineLogoWebhookPayload
  | GameEngineWebhookPayload
  | GenreWebhookPayload
  | InvolvedCompanyWebhookPayload
  | KeywordWebhookPayload
  | LanguageWebhookPayload
  | LanguageSupportWebhookPayload
  | LanguageSupportTypeWebhookPayload
  | MultiplayerModeWebhookPayload
  | PlatformFamilyWebhookPayload
  | PlatformLogoWebhookPayload
  | PlatformTypeWebhookPayload
  | PlatformWebhookPayload
  | PlayerPerspectiveWebhookPayload
  | ReleaseDateWebhookPayload
  | ReleaseDateRegionWebhookPayload
  | ReleaseDateStatusWebhookPayload
  | ScreenshotWebhookPayload
  | ThemeWebhookPayload
  | WebsiteTypeWebhookPayload
  | WebsiteWebhookPayload;

export interface DeleteWebhookPayload {
  id: number;
}

export interface WebhookDispatchResult {
  outcome: WebhookOutcome;
  statusCode: 202 | 204;
}

export interface RelationReplaceContext<TPayload extends RawIgdbPayload = RawIgdbPayload> {
  manager: EntityManager;
  payload: TPayload;
  resource: WebhookResource;
  rootId: number;
}

export interface BaseResourceDefinition<
  TPayload extends RawIgdbPayload = RawIgdbPayload,
  TEntity extends ObjectLiteral = ObjectLiteral,
> {
  entity: EntityTarget<TEntity>;
  kind: "aggregate" | "simple";
  map(payload: TPayload): Partial<TEntity>;
  resource: WebhookResource;
  staleProtection: StaleProtectionMode;
}

export interface SimpleResourceDefinition<
  TPayload extends RawIgdbPayload = RawIgdbPayload,
  TEntity extends ObjectLiteral = ObjectLiteral,
> extends BaseResourceDefinition<TPayload, TEntity> {
  kind: "simple";
}

export interface AggregateResourceDefinition<
  TPayload extends RawIgdbPayload = RawIgdbPayload,
  TEntity extends ObjectLiteral = ObjectLiteral,
> extends BaseResourceDefinition<TPayload, TEntity> {
  kind: "aggregate";
  replaceRelations(context: RelationReplaceContext<TPayload>): Promise<void>;
}

export type ResourceDefinition = AggregateResourceDefinition | SimpleResourceDefinition;
