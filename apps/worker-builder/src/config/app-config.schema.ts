import Joi from "joi";

export const APP_CONFIG_SCHEMA = Joi.object({
  REDIS_HOST: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  WORKER_BUILDER_CONCURRENCY: Joi.number().integer().min(1).optional(),
}).unknown(true);
