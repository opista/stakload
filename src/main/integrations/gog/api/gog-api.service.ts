import { Service } from "typedi";

import { SharedConfigService } from "../../../config/shared-config.service";
import { GogTokenConfig, LibraryData, LibraryProduct, TokenResponse } from "./types";

export const CLIENT_ID = "46899977096215655";
export const CLIENT_SECRET = "9d85c43b1482497dbbce61f6e4aa173a433796eeae2ca8c5f6129f2dc4de46d9";
export const REDIRECT_URI = "https://embed.gog.com/on_login_success?origin=client";

@Service()
export class GogApiService {
  constructor(private readonly sharedConfigService: SharedConfigService) {}

  async getValidToken(): Promise<string | null> {
    const config = this.sharedConfigService.get("integration_settings.state.gogIntegration", { decrypt: true });

    if (!config) return null;

    if (Date.now() >= config.expiresAt) {
      const newTokens = await this.refreshAccessToken(config.refreshToken);

      // If refresh token is invalid, clear the config and return null
      if (!newTokens || newTokens.error) {
        await this.sharedConfigService.delete("integration_settings.state.gogIntegration");
        return null;
      }

      await this.saveTokens(newTokens);
      return newTokens.access_token;
    }

    return config.accessToken;
  }

  private async saveTokens(tokens: TokenResponse) {
    const expiresAt = Date.now() + tokens.expires_in * 1000;

    const config: GogTokenConfig = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
    };

    await this.sharedConfigService.set("integration_settings.state.gogIntegration", config, { encrypt: true });
  }

  async getProductsOnPage(page: number, token: string) {
    const response = await fetch(
      `https://www.gog.com/account/getFilteredProducts?hiddenFlag=0&mediaType=1&page=${page}&sortBy=title`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const libraryData: LibraryData = await response.json();

    return libraryData;
  }

  async getOwnedGames(token: string) {
    const firstPage = await this.getProductsOnPage(1, token);

    if (!firstPage?.products) {
      throw new Error("GOG library content is empty");
    }

    if (firstPage.totalPages <= 1) {
      return firstPage.products;
    }

    const remainingPages = Array.from({ length: firstPage.totalPages - 1 }, (_, i) => i + 2);

    const remainingProducts = await remainingPages.reduce(
      async (accPromise, pageNumber) => {
        const acc = await accPromise;

        try {
          const pageData = await this.getProductsOnPage(pageNumber, token);
          return pageData?.products ? [...acc, ...pageData.products] : acc;
        } catch (error) {
          console.error(`Failed to fetch GOG library page ${pageNumber}:`, error);
          return acc;
        }
      },
      Promise.resolve([] as LibraryProduct[]),
    );

    return [...firstPage.products, ...remainingProducts];
  }

  async getAuthToken(code: string): Promise<TokenResponse> {
    const tokenUrl = "https://auth.gog.com/token";
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data: TokenResponse = await response.json();

    if (data.error) {
      throw new Error(`Authentication failed: ${data.error}`);
    }

    await this.saveTokens(data);

    return data;
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse | null> {
    try {
      const response = await fetch("https://auth.gog.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
      });

      const data: TokenResponse = await response.json();

      // Check if the refresh token is invalid
      if (data.error) {
        console.error("Refresh token error:", data.error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Failed to refresh token:", err);
      return null;
    }
  }
}
