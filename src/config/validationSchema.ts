import * as Joi from 'joi';

export const validationSchema = Joi.object({
    DATABASE_NAME: Joi.string().required(),
    DATABASE_TYPE: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required(),
    DATABASE_USERNAME: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_TEST2_NAME: Joi.string().required(),
    DATABASE_AUTH_NAME: Joi.string().required(),
    DATABASE_COMMON_NAME: Joi.string().required(),
    DATABASE_GAME_NAME: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
});
