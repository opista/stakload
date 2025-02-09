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
