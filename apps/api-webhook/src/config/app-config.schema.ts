import Joi from "joi";

export const APP_CONFIG_SCHEMA = Joi.object({
  DATABASE_URL: Joi.string()
    .uri({ scheme: [/postgres/, /postgresql/] })
    .required(),
  HOST: Joi.string().hostname().default("127.0.0.1"),
  IGDB_WEBHOOK_SECRET: Joi.string().min(1).required(),
  LOG_LEVEL: Joi.string().valid("debug", "error", "fatal", "log", "verbose", "warn").default("log"),
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
  PORT: Joi.number().integer().min(1).max(65535).default(3001),
}).unknown(true);
