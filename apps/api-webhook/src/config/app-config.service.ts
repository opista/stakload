import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

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
