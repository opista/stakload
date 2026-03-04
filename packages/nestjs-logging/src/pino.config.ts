import type { Params } from "nestjs-pino";

export const createPinoHttpConfig = (): NonNullable<Params["pinoHttp"]> => ({
  formatters: {
    level: (level) => ({ level }),
  },
  level: process.env.LOG_LEVEL ?? "info",
  mixin: () => ({
    ts: process.hrtime.bigint().toString(),
  }),
  mixinMergeStrategy: (mergeObject, mixinObject) => Object.assign(mixinObject, mergeObject),
  transport: {
    options: {
      colorize: true,
      ignore: "ts,hostname",
      singleLine: true,
    },
    target: "pino-pretty",
  },
});
