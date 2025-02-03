import { decryptString } from "@util/safe-storage";
import { Conf } from "electron-conf/main";
import { Inject, Service } from "typedi";

import { Config } from "./types";

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TypeAtPath<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? TypeAtPath<T[K], R>
      : never
    : never;

@Service()
export class SharedConfigService {
  constructor(@Inject("conf") private readonly conf: Conf<Config>) {}

  get<P extends NestedKeyOf<Config>>(path: P): TypeAtPath<Config, P> {
    return this.conf.get(path) as TypeAtPath<Config, P>;
  }

  decryptGet<P extends NestedKeyOf<Config>>(path: P) {
    const value = this.get(path);

    if (typeof value === "string") {
      return decryptString(value);
    }

    return value;
  }

  delete<P extends NestedKeyOf<Config>>(path: P) {
    this.conf.delete(path);
  }

  set<P extends NestedKeyOf<Config>>(path: P, value: TypeAtPath<Config, P>) {
    this.conf.set(path, value);
  }
}
