import { Service } from "typedi";

import { SharedConfigService } from "../../../config/shared-config.service";
import { LoggerService } from "../../../logger/logger.service";
import { BattleNetTokenConfig, TokenResponse } from "./types";

// Values from Playnite's Battle.net implementation
export const CLIENT_ID = "5a6948e164e84937b3f4ac875e2d37d9";
export const CLIENT_SECRET = "Yd1h1qp8mWYvFEJNgyOPGEzE9CvMBmLt";
export const REDIRECT_URI = "http://localhost:6905/callback";

@Service()
export class BattleNetApiService {
  constructor(
    private readonly sharedConfigService: SharedConfigService,
    private readonly logger: LoggerService,
  ) {}

  async getValidToken(): Promise<string | null> {
    this.logger.debug("Fetching valid Battle.net token from configuration");
    const config = this.sharedConfigService.get("integration_settings.state.battleNetIntegration", { decrypt: true });

    if (!config) {
      this.logger.debug("No Battle.net integration config found");
      return null;
    }

    if (Date.now() >= config.expiresAt) {
      this.logger.info("Battle.net token expired; attempting to refresh", { expiresAt: config.expiresAt });
      const newTokens = await this.refreshAccessToken(config.refreshToken);

      if (!newTokens || newTokens.error) {
        this.logger.error("Failed to refresh Battle.net token; clearing integration config", {
          refreshToken: config.refreshToken,
        });
        await this.sharedConfigService.delete("integration_settings.state.battleNetIntegration");
        return null;
      }

      await this.saveTokens(newTokens);
      this.logger.info("Battle.net token refreshed successfully");
      return newTokens.access_token;
    }

    this.logger.debug("Battle.net token is valid");
    return config.accessToken;
  }

  private async saveTokens(tokens: TokenResponse) {
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    const config: BattleNetTokenConfig = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
    };
    this.logger.debug("Saving new Battle.net tokens", { expiresAt });
    await this.sharedConfigService.set("integration_settings.state.battleNetIntegration", config, { encrypt: true });
  }

  async getAuthToken(code: string): Promise<TokenResponse> {
    this.logger.debug("Authenticating with Battle.net using code", { code });
    const tokenUrl = "https://oauth.battle.net/token";
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
      this.logger.error("Battle.net authentication failed", { error: data.error });
      throw new Error(`Authentication failed: ${data.error}`);
    }

    await this.saveTokens(data);
    this.logger.info("Battle.net authentication succeeded");
    return data;
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse | null> {
    this.logger.debug("Refreshing Battle.net access token", { refreshToken });
    try {
      const response = await fetch("https://oauth.battle.net/token", {
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

      if (data.error) {
        this.logger.error("Refresh token error", { error: data.error });
        return null;
      }

      this.logger.debug("Battle.net token refreshed", { accessToken: data.access_token });
      return data;
    } catch (err) {
      this.logger.error("Failed to refresh Battle.net token", err);
      return null;
    }
  }

  async getOwnedGames(token: string): Promise<any[]> {
    this.logger.debug("Fetching owned games from Battle.net", { tokenProvided: !!token });
    // Battle.net requires region specification, defaulting to 'us'
    const response = await fetch("https://us.api.blizzard.com/oauth/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log({ battleowned: data });
    // TODO: Implement proper game fetching logic using Battle.net APIs
    // This is a placeholder - actual implementation will need to handle
    // different game types (WoW, Overwatch, etc.)
    return [];
  }
}
