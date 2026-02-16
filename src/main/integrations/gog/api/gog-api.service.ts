import { ConsoleLogger, Injectable } from "@nestjs/common";

import { SharedConfigService } from "../../../config/shared-config.service";

import { GogTokenConfig, LibraryData, LibraryProduct, TokenResponse } from "./types";

export const CLIENT_ID = "46899977096215655";
export const CLIENT_SECRET = "9d85c43b1482497dbbce61f6e4aa173a433796eeae2ca8c5f6129f2dc4de46d9";
export const REDIRECT_URI = "https://embed.gog.com/on_login_success?origin=client";

@Injectable()
export class GogApiService {
  constructor(
    private readonly sharedConfigService: SharedConfigService,
    private readonly logger: ConsoleLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private async saveTokens(tokens: TokenResponse) {
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    const config: GogTokenConfig = {
      accessToken: tokens.access_token,
      expiresAt,
      refreshToken: tokens.refresh_token,
    };
    this.logger.debug("Saving new GOG tokens", { expiresAt });
    await this.sharedConfigService.set("integration_settings.state.gogIntegration", config, { encrypt: true });
  }

  async getAuthToken(code: string): Promise<TokenResponse> {
    this.logger.debug("Authenticating with GOG using code", { code });
    const tokenUrl = "https://auth.gog.com/token";
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    });

    const response = await fetch(tokenUrl, {
      body: params.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const data: TokenResponse = await response.json();

    if (data.error) {
      this.logger.error("GOG authentication failed", { error: data.error });
      throw new Error(`Authentication failed: ${data.error}`);
    }

    await this.saveTokens(data);
    this.logger.log("GOG authentication succeeded");
    return data;
  }

  async getOwnedGames(token: string): Promise<LibraryProduct[]> {
    this.logger.debug("Fetching owned games from GOG", { tokenProvided: !!token });
    const firstPage = await this.getProductsOnPage(1, token);

    if (!firstPage?.products) {
      this.logger.error("GOG library content is empty on first page");
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
          this.logger.error(`Failed to fetch GOG library page ${pageNumber}`, error, { pageNumber });
          return acc;
        }
      },
      Promise.resolve([] as LibraryProduct[]),
    );

    return [...firstPage.products, ...remainingProducts];
  }

  async getProductsOnPage(page: number, token: string): Promise<LibraryData> {
    this.logger.debug("Fetching GOG products on page", { page });
    const response = await fetch(
      `https://www.gog.com/account/getFilteredProducts?hiddenFlag=0&mediaType=1&page=${page}&sortBy=title`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const libraryData: LibraryData = await response.json();
    this.logger.debug("Fetched GOG products on page", { page, totalProducts: libraryData.totalProducts });
    return libraryData;
  }

  async getValidToken(): Promise<string | null> {
    this.logger.debug("Fetching valid GOG token from configuration");
    const config = this.sharedConfigService.get("integration_settings.state.gogIntegration", { decrypt: true });

    if (!config) {
      this.logger.debug("No GOG integration config found");
      return null;
    }

    if (Date.now() >= config.expiresAt) {
      this.logger.log("GOG token expired; attempting to refresh", { expiresAt: config.expiresAt });
      const newTokens = await this.refreshAccessToken(config.refreshToken);

      if (!newTokens || newTokens.error) {
        this.logger.error("Failed to refresh GOG token; clearing integration config", {
          refreshToken: config.refreshToken,
        });
        await this.sharedConfigService.delete("integration_settings.state.gogIntegration");
        return null;
      }

      await this.saveTokens(newTokens);
      this.logger.log("GOG token refreshed successfully");
      return newTokens.access_token;
    }

    this.logger.debug("GOG token is valid");
    return config.accessToken;
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse | null> {
    this.logger.debug("Refreshing GOG access token", { refreshToken });
    try {
      const response = await fetch("https://auth.gog.com/token", {
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      });

      const data: TokenResponse = await response.json();

      if (data.error) {
        this.logger.error("Refresh token error", { error: data.error });
        return null;
      }

      this.logger.debug("GOG token refreshed", { accessToken: data.access_token });
      return data;
    } catch (err) {
      this.logger.error("Failed to refresh GOG token", err);
      return null;
    }
  }
}
