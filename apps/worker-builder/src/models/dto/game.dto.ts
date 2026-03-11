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

export interface GameDto {
  cover: ImageDto | null;
  firstReleaseDate: number | null;
  genres: ReferenceItemDto[];
  id: number;
  name: string;
  platforms: ReferenceItemDto[];
  rating: number | null;
  summary: string | null;
  themes: ReferenceItemDto[];
}
