export interface LibraryProduct {
  id: number;
  slug: string;
  tags: [];
  title: string;
}

export interface LibraryData {
  contentSystemCompatibility: string | null;
  hiddenUpdatedProductsCount: number;
  moviesCount: number;
  page: number;
  products: LibraryProduct[];
  productsPerPage: number;
  sortBy: string;
  totalPages: number;
  totalProducts: number;
  updatedProductsCount: number;
}

export interface TokenResponse {
  access_token: string;
  error?: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface GogTokenConfig {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
}
