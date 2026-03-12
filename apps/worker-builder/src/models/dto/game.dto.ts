export interface ReferenceItemDto {
  id: number;
  name: string;
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
  company: ReferenceItemDto;
  developer: boolean;
  id: number;
  porting: boolean;
  publisher: boolean;
  supporting: boolean;
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
  artworks: ImageDto[];
  cover: ImageDto | null;
  developers: ReferenceItemDto[];
  firstReleaseDate: number | null;
  gameModes: ReferenceItemDto[];
  gameStatus: ReferenceItemDto | null;
  gameType: ReferenceItemDto | null;
  genres: ReferenceItemDto[];
  id: number;
  keywords: ReferenceItemDto[];
  name: string;
  platforms: ReferenceItemDto[];
  playerPerspectives: ReferenceItemDto[];
  publishers: ReferenceItemDto[];
  rating: number | null;
  ratingCount: number | null;
  screenshots: ImageDto[];
  slug: string | null;
  storyline: string | null;
  summary: string | null;
  themes: ReferenceItemDto[];
  totalRating: number | null;
  totalRatingCount: number | null;
  url: string | null;
  videos: VideoDto[];
  websites: WebsiteDto[];
}
