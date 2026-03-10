import { DynamicModule, Module, type Provider } from "@nestjs/common";
import Redis from "ioredis";

import { REDIS_CLIENT } from "./constants";
import { RedisService } from "./redis.service";
import type { RedisModuleAsyncOptions, RedisModuleOptions } from "./types";

@Module({})
export class RedisModule {
  private static createRedisProvider(options: RedisModuleAsyncOptions): Provider {
    return {
      inject: options.inject,
      provide: REDIS_CLIENT,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useFactory: async (...args: any[]) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const redisOptions = await options.useFactory(...args);
        return new Redis(redisOptions);
      },
    };
  }

  static forRoot(options: RedisModuleOptions): DynamicModule {
    return {
      exports: [RedisService],
      module: RedisModule,
      providers: [
        RedisService,
        {
          provide: REDIS_CLIENT,
          useValue: new Redis(options),
        },
      ],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      exports: [RedisService],
      imports: options.imports,
      module: RedisModule,
      providers: [RedisService, this.createRedisProvider(options)],
    };
  }
}
