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
  id: number;
  company: ReferenceItemDto;
  developer: boolean;
  publisher: boolean;
  porting: boolean;
  supporting: boolean;
}

export interface GameDto {
  // Identity
  id: number;
  name: string;
  slug: string | null;
  url: string | null;

  // Description
  summary: string | null;
  storyline: string | null;

  // Dates
  firstReleaseDate: number | null;

  // Ratings
  rating: number | null;
  ratingCount: number | null;
  aggregatedRating: number | null;
  aggregatedRatingCount: number | null;
  totalRating: number | null;
  totalRatingCount: number | null;

  // Classification
  gameStatus: ReferenceItemDto | null;
  gameType: ReferenceItemDto | null;

  // Reference lookups
  genres: ReferenceItemDto[];
  platforms: ReferenceItemDto[];
  themes: ReferenceItemDto[];
  gameModes: ReferenceItemDto[];
  playerPerspectives: ReferenceItemDto[];
  keywords: ReferenceItemDto[];

  // Media
  cover: ImageDto | null;
  artworks: ImageDto[];
  screenshots: ImageDto[];
  videos: VideoDto[];

  // Companies
  involvedCompanies: InvolvedCompanyDto[];
}
