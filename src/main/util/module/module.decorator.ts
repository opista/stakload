import "reflect-metadata";

export const Module = (metadata: { exports?: unknown[]; imports?: unknown[]; providers?: unknown[] }) => {
  return function (target: Object) {
    Reflect.defineMetadata("module:providers", metadata.providers || [], target);
    Reflect.defineMetadata("module:imports", metadata.imports || [], target);
    Reflect.defineMetadata("module:exports", metadata.exports || [], target);
  };
};
