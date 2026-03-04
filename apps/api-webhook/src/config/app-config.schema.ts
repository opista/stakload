import Joi from "joi";

export const APP_CONFIG_SCHEMA = Joi.object({
  DATABASE_SYNCHRONIZE: Joi.boolean().truthy("true").falsy("false").default(false),
  DATABASE_URL: Joi.string()
    .uri({ scheme: [/postgres/, /postgresql/] })
    .required(),
  IGDB_WEBHOOK_SECRET: Joi.string().min(1).required(),
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
}).unknown(true);
