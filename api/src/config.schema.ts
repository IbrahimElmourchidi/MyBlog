import * as joi from 'joi';

export const ConfigValidationSchema = joi.object({
  DB_URL: joi.string().required(),
  DB_SYNC: joi.boolean().required(),
  JWT_SECRET: joi.string().required(),
});
