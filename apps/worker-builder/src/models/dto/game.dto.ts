export interface ReferenceItemDto {
  id: number;
  name: string;
}

export interface RichReferenceItemDto extends ReferenceItemDto {
  checksum?: string | null;
  createdAt?: string | null;
  slug?: string | null;
  sourceUpdatedAt?: string | null;
  updatedAt?: string | null;
  url?: string | null;
}

export interface ImageDto {
  animated: boolean | null;
  height: number | null;
  imageId: string | null;
  width: number | null;
}

export interface VideoDto {
  id: number;
  name: string | null;
  videoId: string | null;
}

export interface InvolvedCompanyDto {
  checksum?: string | null;
  company: ReferenceItemDto;
  companyDetails?: RichReferenceItemDto | null;
  createdAt?: string | null;
  developer: boolean;
  game?: number | null;
  id: number;
  porting: boolean;
  publisher: boolean;
  sourceUpdatedAt?: string | null;
  supporting: boolean;
  updatedAt?: string | null;
}

export interface AlternativeNameDto {
  checksum: string | null;
  comment: string | null;
  createdAt: string | null;
  game: number | null;
  id: number;
  name: string;
  sourceUpdatedAt: string | null;
  updatedAt: string | null;
}

export interface CollectionDto extends RichReferenceItemDto {
  description: string | null;
  games: number[] | null;
}

export interface ExternalGameDto {
  checksum: string | null;
  countries: number[] | null;
  createdAt: string | null;
  externalGameSource: number | null;
  externalGameSourceDetails: RichReferenceItemDto | null;
  game: number | null;
  gameReleaseFormat: number | null;
  gameReleaseFormatDetails: RichReferenceItemDto | null;
  id: number;
  name: string | null;
  platform: number | null;
  platformDetails: RichReferenceItemDto | null;
  sourceUpdatedAt: string | null;
  uid: string | null;
  updatedAt: string | null;
  url: string | null;
  year: number | null;
}

export interface GameEngineDto extends RichReferenceItemDto {
  companies: number[] | null;
  description: string | null;
  logo: number | null;
}

export interface LanguageSupportDto {
  checksum: string | null;
  createdAt: string | null;
  game: number | null;
  id: number;
  language: number | null;
  languageDetails: RichReferenceItemDto | null;
  languageSupportType: number | null;
  languageSupportTypeDetails: RichReferenceItemDto | null;
  sourceUpdatedAt: string | null;
  updatedAt: string | null;
}

export interface MultiplayerModeDto {
  campaignCoop: boolean | null;
  checksum: string | null;
  createdAt: string | null;
  dropIn: boolean | null;
  game: number | null;
  id: number;
  lanCoop: boolean | null;
  offlineCoop: boolean | null;
  offlineCoopMax: number | null;
  offlineMax: number | null;
  onlineCoop: boolean | null;
  onlineCoopMax: number | null;
  onlineMax: number | null;
  platform: number | null;
  sourceUpdatedAt: string | null;
  splitScreen: boolean | null;
  splitScreenOnline: boolean | null;
  updatedAt: string | null;
}

export interface AgeRatingDto {
  descriptions: string[];
  id: number;
  name: string | null;
  organisation: string | null;
}

export interface WebsiteDto {
  id: number;
  trusted: boolean | null;
  url: string;
  websiteType: ReferenceItemDto | null;
}

export interface GameDto {
  ageRatings: AgeRatingDto[];
  aggregatedRating: number | null;
  aggregatedRatingCount: number | null;
  alternativeNames: AlternativeNameDto[];
  artworks: ImageDto[];
  bundles: RichReferenceItemDto[];
  checksum: string | null;
  collections: CollectionDto[];
  cover: ImageDto | null;
  createdAt: string | null;
  developers: ReferenceItemDto[];
  externalGames: ExternalGameDto[];
  firstReleaseDate: number | null;
  franchise: RichReferenceItemDto | null;
  franchises: RichReferenceItemDto[];
  gameEngines: GameEngineDto[];
  gameModes: ReferenceItemDto[];
  gameStatus: ReferenceItemDto | null;
  gameType: ReferenceItemDto | null;
  genres: ReferenceItemDto[];
  id: number;
  involvedCompanies: InvolvedCompanyDto[];
  keywords: ReferenceItemDto[];
  languageSupports: LanguageSupportDto[];
  multiplayerModes: MultiplayerModeDto[];
  name: string;
  parentGame: RichReferenceItemDto | null;
  platforms: ReferenceItemDto[];
  playerPerspectives: ReferenceItemDto[];
  publishers: ReferenceItemDto[];
  rating: number | null;
  ratingCount: number | null;
  screenshots: ImageDto[];
  similarGames: RichReferenceItemDto[];
  slug: string | null;
  sourceUpdatedAt: string | null;
  storyline: string | null;
  summary: string | null;
  themes: ReferenceItemDto[];
  totalRating: number | null;
  totalRatingCount: number | null;
  updatedAt: string | null;
  url: string | null;
  versionParent: RichReferenceItemDto | null;
  versionTitle: string | null;
  videos: VideoDto[];
  websites: WebsiteDto[];
}
