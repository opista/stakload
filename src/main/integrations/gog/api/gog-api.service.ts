import { Service } from "typedi";

import { LibraryData, LibraryProduct } from "./types";

const GOG_API_BASE_URL = "https://www.gog.com/account/getFilteredProducts";

@Service()
export class GogApiService {
  async getProductsOnPage(page: number, token: string) {
    const response = await fetch(`${GOG_API_BASE_URL}?hiddenFlag=0&mediaType=1&page=${page}&sortBy=title`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const libraryData: LibraryData = await response.json();

    return libraryData;
  }

  async getOwnedGames(token: string) {
    const games: LibraryProduct[] = [];

    const libraryData = await this.getProductsOnPage(1, token);

    if (!libraryData?.products) {
      throw new Error("GOG library content is empty");
    }

    // Add first page of games
    games.push(...libraryData.products);

    // If there are more pages, fetch them
    if (libraryData.totalPages > 1) {
      // Fetch remaining pages sequentially to avoid rate limiting
      for (let page = 2; page <= libraryData.totalPages; page++) {
        try {
          const pageData = await this.getProductsOnPage(page, token);
          if (pageData?.products) {
            games.push(...pageData.products);
          }
        } catch (error) {
          console.error(`Failed to fetch GOG library page ${page}:`, error);
          // Continue with next page if one fails
        }
      }
    }

    return games;
  }
}
