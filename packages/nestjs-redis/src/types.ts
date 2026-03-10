import type { FactoryProvider, ModuleMetadata } from "@nestjs/common";
import type { RedisOptions } from "ioredis";

export type RedisModuleOptions = RedisOptions;

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  inject?: FactoryProvider["inject"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
}
