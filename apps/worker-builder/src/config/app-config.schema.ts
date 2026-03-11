import Joi from "joi";

export const APP_CONFIG_SCHEMA = Joi.object({
  DATABASE_URL: Joi.string()
    .uri({ scheme: [/postgres/, /postgresql/] })
    .required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),
  REDIS_PORT: Joi.number().integer().min(1).max(65535).required(),
  WORKER_BUILDER_CONCURRENCY: Joi.number().integer().min(1).optional().default(4),
}).unknown(true);
