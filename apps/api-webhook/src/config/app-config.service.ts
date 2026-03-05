import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { PinoLogger } from "@stakload/nestjs-logging";

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  get databaseSynchronize(): boolean {
    return this.configService.getOrThrow<boolean>("DATABASE_SYNCHRONIZE");
  }

  get databaseUrl(): string {
    return this.configService.getOrThrow<string>("DATABASE_URL");
  }

  get igdbClientId(): string {
    return this.configService.getOrThrow<string>("IGDB_CLIENT_ID");
  }

  get igdbClientSecret(): string {
    return this.configService.getOrThrow<string>("IGDB_CLIENT_SECRET");
  }

  get igdbWebhookSecret(): string {
    return this.configService.getOrThrow<string>("IGDB_WEBHOOK_SECRET");
  }

  get nodeEnv(): string {
    return this.configService.getOrThrow<string>("NODE_ENV");
  }

  get publicWebhookBaseUrl(): string {
    const url = this.configService.getOrThrow<string>("PUBLIC_WEBHOOK_BASE_URL");

    return url.replace(/\/+$/, "");
  }
}
