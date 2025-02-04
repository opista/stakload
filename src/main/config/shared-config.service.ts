import { decryptString, encryptString } from "@util/safe-storage";
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

  get<P extends NestedKeyOf<Config>>(
    path: P,
    { decrypt = false }: { decrypt?: boolean } = {},
  ): TypeAtPath<Config, P> | string {
    const value = this.conf.get(path) as TypeAtPath<Config, P>;

    if (decrypt && typeof value === "string") {
      const decrypted = decryptString(value);
      return JSON.parse(decrypted);
    }

    return value;
  }

  delete<P extends NestedKeyOf<Config>>(path: P) {
    this.conf.delete(path);
  }

  set<P extends NestedKeyOf<Config>>(
    path: P,
    value: TypeAtPath<Config, P>,
    { encrypt = false }: { encrypt?: boolean } = {},
  ) {
    if (encrypt) {
      this.conf.set(path, encryptString(JSON.stringify(value)));
    } else {
      this.conf.set(path, value);
    }
  }
}
