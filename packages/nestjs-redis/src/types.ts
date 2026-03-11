import type { InjectionToken } from "@nestjs/common";

export interface RedisModuleOptions {
  host: string;
  password?: string;
  port: number;
}

export interface RedisModuleAsyncOptions {
  inject?: InjectionToken[];
  useFactory: (...args: unknown[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
}
