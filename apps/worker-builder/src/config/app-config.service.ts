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

  get logLevel(): string {
    return this.configService.getOrThrow<string>("LOG_LEVEL");
  }

  get nodeEnv(): string {
    return this.configService.getOrThrow<string>("NODE_ENV");
  }

  get redisHost(): string {
    return this.configService.getOrThrow<string>("REDIS_HOST");
  }

  get redisPassword(): string {
    return this.configService.getOrThrow<string>("REDIS_PASSWORD");
  }

  get redisPort(): number {
    return this.configService.getOrThrow<number>("REDIS_PORT");
  }

  get workerBuilderConcurrency(): number {
    return this.configService.getOrThrow<number>("WORKER_BUILDER_CONCURRENCY");
  }
}
