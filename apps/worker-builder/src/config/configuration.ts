export default () => ({
  logLevel: process.env.LOG_LEVEL ?? "info",
  nodeEnv: process.env.NODE_ENV ?? "development",
  redis: {
    host: process.env.REDIS_HOST ?? "redis",
    password: process.env.REDIS_PASSWORD ?? undefined,
    port: parseInt(process.env.REDIS_PORT ?? "6379", 10),
  },
  workerBuilderConcurrency: parseInt(process.env.WORKER_BUILDER_CONCURRENCY ?? "4", 10),
});
