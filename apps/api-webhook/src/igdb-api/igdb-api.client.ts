import { Injectable } from "@nestjs/common";

import { PinoLogger } from "@stakload/nestjs-logging";

import { AppConfigService } from "../config/app-config.service";
import type { IgdbOAuthTokenResponse } from "./types/igdb-api.types";
import { IgdbApiError } from "./types/igdb-api.types";

const IGDB_API_BASE_URL = "https://api.igdb.com/v4";
const TOKEN_EXPIRY_BUFFER_MS = 60_000;
const TWITCH_OAUTH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";

@Injectable()
export class IgdbApiClient {
  private accessToken: string | null = null;
  private expiresAt = 0;
  private refreshPromise: Promise<string> | null = null;

  constructor(
    private readonly configService: AppConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private buildErrorMessage(statusCode: number, body: unknown): string {
    if (typeof body === "string" && body.length > 0) {
      return body;
    }

    if (typeof body === "object" && body !== null) {
      if ("message" in body && typeof body.message === "string") {
        return body.message;
      }

      if ("error" in body && typeof body.error === "string") {
        return body.error;
      }
    }

    return `IGDB API request failed with status ${statusCode}`;
  }

  private async fetchAccessToken(): Promise<string> {
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

  private async getAccessToken(): Promise<string> {
    if (this.hasValidToken()) {
      return this.accessToken as string;
    }

    if (this.refreshPromise !== null) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.fetchAccessToken();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private hasValidToken(): boolean {
    return this.accessToken !== null && Date.now() < this.expiresAt - TOKEN_EXPIRY_BUFFER_MS;
  }

  private invalidateToken(): void {
    this.accessToken = null;
    this.expiresAt = 0;
  }

  private parseResponseBody(text: string): unknown {
    if (text.length === 0) {
      return null;
    }

    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  async requestJson<T>(path: string, init: RequestInit, operation: string, retryOnUnauthorized = true): Promise<T> {
    const token = await this.getAccessToken();
    const response = await fetch(`${IGDB_API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-ID": this.configService.igdbClientId,
        ...(init.headers ?? {}),
      },
    });

    if (response.status === 401 && retryOnUnauthorized) {
      this.logger.warn({ operation }, "IGDB request returned 401; retrying once with a fresh token");
      this.invalidateToken();

      return this.requestJson<T>(path, init, operation, false);
    }

    const text = await response.text();
    const body = this.parseResponseBody(text);

    if (response.ok === false) {
      this.logger.error({ operation, statusCode: response.status }, "IGDB API request failed");
      throw new IgdbApiError(this.buildErrorMessage(response.status, body), response.status, body);
    }

    return body as T;
  }
}
