import type { InjectionToken } from "@nestjs/common";

export interface RedisModuleOptions {
  host: string;
  password?: string;
  port: number;
}

export interface RedisModuleAsyncOptions {
  inject?: InjectionToken[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
}
