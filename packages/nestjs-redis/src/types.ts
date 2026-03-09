import type { FactoryProvider, ModuleMetadata } from "@nestjs/common";
import type { RedisOptions } from "ioredis";

export type RedisModuleOptions = RedisOptions;

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  inject?: FactoryProvider["inject"];
  useFactory: (...args: unknown[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
}
