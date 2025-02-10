import { decryptString, encryptString } from "@util/safe-storage";
import { Conf } from "electron-conf/main";
import { Inject, Service } from "typedi";

import { Config } from "./types";

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object | undefined
    ? `${Key}` | `${Key}.${NestedKeyOf<Exclude<ObjectType[Key], undefined>>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

type TypeAtPath<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? T[K] extends object | undefined
        ? TypeAtPath<Exclude<T[K], undefined>, R> | undefined
        : never
      : never
    : never;

@Service()
export class SharedConfigService {
  constructor(@Inject("conf") private readonly conf: Conf<Config>) {}

  get<P extends NestedKeyOf<Config>>(path: P, { decrypt = false }: { decrypt?: boolean } = {}): TypeAtPath<Config, P> {
    const value = this.conf.get(path) as TypeAtPath<Config, P>;

    if (decrypt && typeof value === "string") {
      const decrypted = decryptString(value);

      try {
        return JSON.parse(decrypted) as TypeAtPath<Config, P>;
      } catch {
        return decrypted as TypeAtPath<Config, P>;
      }
    }

    return value;
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

  delete<P extends NestedKeyOf<Config>>(path: P) {
    this.conf.delete(path);
  }
}
