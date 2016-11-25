
const Schema = require('mongoose').Schema

/**
 * Authorisation Schema
 */
module.exports = new Schema({
  method: String,
  path: String
});
