import Joi from "joi";

export const APP_CONFIG_SCHEMA = Joi.object({
  LOG_LEVEL: Joi.string()
    .valid("fatal", "error", "warn", "info", "debug", "trace", "silent")
    .default("info"),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  REDIS_HOST: Joi.string().default("redis"),
  REDIS_PASSWORD: Joi.string().allow(""),
  REDIS_PORT: Joi.number().default(6379),
  WORKER_BUILDER_CONCURRENCY: Joi.number().min(1).default(4),
}).unknown(true);
