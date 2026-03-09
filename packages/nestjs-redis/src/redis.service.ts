import { Inject, Injectable, OnModuleDestroy } from "@nestjs/common";
import type { Redis } from "ioredis";

import { REDIS_CLIENT } from "./constants";

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  async onModuleDestroy(): Promise<void> {
    try {
      await this.redisClient.quit();
    } catch {
      this.redisClient.disconnect();
    }
  }

  async sadd(key: string, ...members: Array<number | string>): Promise<number> {
    if (members.length === 0) {
      return 0;
    }

    return this.redisClient.sadd(key, ...members);
  }

  async srem(key: string, ...members: Array<number | string>): Promise<number> {
    if (members.length === 0) {
      return 0;
    }

    return this.redisClient.srem(key, ...members);
  }

  get client(): Redis {
    return this.redisClient;
  }
}
