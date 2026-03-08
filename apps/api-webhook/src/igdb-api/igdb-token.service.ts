import { Injectable } from "@nestjs/common";

import { PinoLogger } from "@stakload/nestjs-logging";

import { AppConfigService } from "../config/app-config.service";
import type { IgdbOAuthTokenResponse } from "./types/igdb-api.types";

const TOKEN_EXPIRY_BUFFER_MS = 60_000;
const TWITCH_OAUTH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";

@Injectable()
export class IgdbTokenService {
  private accessToken: string | null = null;
  private expiresAt = 0;
  private refreshPromise: Promise<string> | null = null;

  constructor(
    private readonly configService: AppConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private async fetchToken(): Promise<string> {
    this.logger.info("Refreshing IGDB access token");

    const url = new URL(TWITCH_OAUTH_TOKEN_URL);
    url.searchParams.set("client_id", this.configService.igdbClientId);
    url.searchParams.set("client_secret", this.configService.igdbClientSecret);
    url.searchParams.set("grant_type", "client_credentials");

    const response = await fetch(url, { method: "POST" });
    const payload = (await response.json()) as Partial<IgdbOAuthTokenResponse> & Record<string, unknown>;

    if (response.ok === false || typeof payload.access_token !== "string" || typeof payload.expires_in !== "number") {
      this.logger.error({ statusCode: response.status }, "Failed to refresh IGDB access token");
      throw new Error(`Failed to refresh IGDB access token: ${response.status}`);
    }

    this.accessToken = payload.access_token;
    this.expiresAt = Date.now() + payload.expires_in * 1000;
    this.logger.info("Refreshed IGDB access token");

    return payload.access_token;
  }

  private isValid(): boolean {
    return this.accessToken !== null && Date.now() < this.expiresAt - TOKEN_EXPIRY_BUFFER_MS;
  }

  async getToken(): Promise<string> {
    if (this.isValid()) {
      return this.accessToken as string;
    }

    if (this.refreshPromise !== null) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.fetchToken();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  invalidate(): void {
    this.accessToken = null;
    this.expiresAt = 0;
  }
}
