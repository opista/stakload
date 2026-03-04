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

  get databaseUrl(): string {
    return this.configService.getOrThrow<string>("DATABASE_URL");
  }

  get igdbWebhookSecret(): string {
    return this.configService.getOrThrow<string>("IGDB_WEBHOOK_SECRET");
  }

  get nodeEnv(): string {
    return this.configService.getOrThrow<string>("NODE_ENV");
  }
}
