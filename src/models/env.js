// ----------------------------------------------------------------------------
// requirements
const Joi = require('joi');

// ----------------------------------------------------------------------------
// create schema
const EnvSchema = Joi.object().keys({
  PROXY_JWT_SECRET: Joi.string().required(),
  PROXY_JWT_ISSUER: Joi.string().required(),
  PROXY_JWT_AUDIENCE: Joi.string().required(),
  PROXY_MONGODB_ADDON_URI: Joi.string().required(),
  PROXY_MONGODB_ADDON_USER: Joi.string(),
  PROXY_MONGODB_ADDON_PASSWORD: Joi.string(),
  PROXY_MONGODB_ADDON_DB: Joi.string(),
  PROXY_MONGODB_ADDON_HOST: Joi.string(),
  PROXY_MONGODB_ADDON_PORT: Joi.number(),
  PROXY_PEPPER: Joi.string().required(),
  PROXY_WARP10_WRITE_TOKEN: Joi.string(),
  PROXY_WARP10_URI: Joi.string(),
  PROXY_DOCKER_SOCKET: Joi.string()
}).or('PROXY_MONGODB_ADDON_URI', [
  'PROXY_MONGODB_ADDON_USER',
  'PROXY_MONGODB_ADDON_PASSWORD',
  'PROXY_MONGODB_ADDON_DB',
  'PROXY_MONGODB_ADDON_HOST',
  'PROXY_MONGODB_ADDON_PORT'
]);

// ----------------------------------------------------------------------------
// exports
module.exports = {EnvSchema};
