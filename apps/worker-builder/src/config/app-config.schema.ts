import Joi from "joi";

export const APP_CONFIG_SCHEMA = Joi.object({
  REDIS_HOST: Joi.string().default("redis"),
  REDIS_PASSWORD: Joi.string().allow(""),
  REDIS_PORT: Joi.number().default(6379),
}).unknown(true);
