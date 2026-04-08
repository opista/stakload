import Joi from "joi";

export const APP_CONFIG_SCHEMA = Joi.object({
  DATABASE_SYNCHRONIZE: Joi.boolean().truthy("true").falsy("false").default(false),
  DATABASE_URL: Joi.string()
    .uri({ scheme: [/postgres/, /postgresql/] })
    .required(),
  IGDB_CLIENT_ID: Joi.string().min(1).required(),
  IGDB_CLIENT_SECRET: Joi.string().min(1).required(),
  IGDB_SCHEDULED_SYNC_ENABLED: Joi.boolean().truthy("true").falsy("false").default(false),
  IGDB_WEBHOOK_SECRET: Joi.string().min(1).required(),
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
  REDIS_HOST: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),
  REDIS_PORT: Joi.number().integer().min(1).max(65535).required(),
  PUBLIC_WEBHOOK_BASE_URL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required(),
}).unknown(true);
