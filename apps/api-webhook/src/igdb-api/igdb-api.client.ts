import { Injectable } from "@nestjs/common";

import { PinoLogger } from "@stakload/nestjs-logging";

import { AppConfigService } from "../config/app-config.service";
import { RateLimiterService } from "../rate-limiter/rate-limiter.service";
import { IgdbTokenService } from "./igdb-token.service";
import { IgdbApiError } from "./types/igdb-api.types";

const IGDB_API_BASE_URL = "https://api.igdb.com/v4";

@Injectable()
export class IgdbApiClient {
  constructor(
    private readonly configService: AppConfigService,
    private readonly logger: PinoLogger,
    private readonly rateLimiter: RateLimiterService,
    private readonly tokenService: IgdbTokenService,
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
    return this.rateLimiter.schedule(async () => {
      const token = await this.tokenService.getToken();
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
        this.tokenService.invalidate();

        return this.requestJson<T>(path, init, operation, false);
      }

      const text = await response.text();
      const body = this.parseResponseBody(text);

      if (response.ok === false) {
        this.logger.error({ operation, statusCode: response.status }, "IGDB API request failed");
        throw new IgdbApiError(this.buildErrorMessage(response.status, body), response.status, body);
      }

      return body as T;
    });
  }
}
