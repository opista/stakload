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

  get databaseUrl() {
    return this.configService.getOrThrow<string>("DATABASE_URL");
  }

  get redisHost() {
    return this.configService.getOrThrow<string>("REDIS_HOST");
  }

  get redisPassword() {
    return this.configService.getOrThrow<string>("REDIS_PASSWORD");
  }

  get redisPort() {
    return this.configService.getOrThrow<number>("REDIS_PORT");
  }

  get workerBuilderConcurrency() {
    return this.configService.getOrThrow<number>("WORKER_BUILDER_CONCURRENCY");
  }
}
