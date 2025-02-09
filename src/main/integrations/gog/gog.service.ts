import { Service } from "typedi";

import { SharedConfigService } from "../../config/shared-config.service";

const CLIENT_ID = "46899977096215655";
const CLIENT_SECRET = "9d85c43b1482497dbbce61f6e4aa173a433796eeae2ca8c5f6129f2dc4de46d9";
const REDIRECT_URI = "https://embed.gog.com/on_login_success?origin=client";

interface TokenResponse {
  access_token: string;
  error?: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

interface GogTokenConfig {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
}

@Service()
export class GogService {
  constructor(private readonly sharedConfigService: SharedConfigService) {}

  private async saveTokens(tokens: TokenResponse) {
    const expiresAt = Date.now() + tokens.expires_in * 1000;

    const config: GogTokenConfig = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
    };

    console.log(tokens);

    await this.sharedConfigService.set("integration_settings.state.gogIntegration", config, { encrypt: true });
  }

  private async getValidToken(): Promise<string | null> {
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

  private async refreshAccessToken(refreshToken: string): Promise<TokenResponse | null> {
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

  async logout() {
    await this.sharedConfigService.delete("integration_settings.state.gogIntegration");
  }

  async login(): Promise<string> {
    const authUrl = `https://auth.gog.com/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&layout=client2`;

    return authUrl;
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

    // Store the tokens immediately after receiving them
    await this.saveTokens(data);

    return data;
  }

  async getOwnedGames() {
    const token = await this.getValidToken();
    if (!token) {
      throw new Error("Not authenticated with GOG");
    }

    const games = [];
    const baseUrl = "https://www.gog.com/account/getFilteredProducts";

    // Get first page
    const response = await fetch(`${baseUrl}?hiddenFlag=0&mediaType=1&page=1&sortBy=title`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const libraryData = await response.json();
    if (!libraryData?.products) {
      throw new Error("GOG library content is empty");
    }

    // Add first page of games
    games.push(...libraryData.products);

    // If there are more pages, fetch them
    if (libraryData.totalPages > 1) {
      const pagePromises = [];
      for (let i = 2; i <= libraryData.totalPages; i++) {
        pagePromises.push(
          fetch(`${baseUrl}?hiddenFlag=0&mediaType=1&page=${i}&sortBy=title`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json()),
        );
      }

      const pageResults = await Promise.all(pagePromises);
      for (const pageData of pageResults) {
        if (pageData?.products) {
          games.push(...pageData.products);
        }
      }
    }

    // Map to a consistent format
    return games.map((game) => ({
      id: game.id.toString(),
      title: game.title,
      url: game.url,
      image: game.image,
    }));
  }
}
