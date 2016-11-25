const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Certificates model
 * Used by Let's Encrypt
 */
module.exports = mongoose.model("Certificate", new Schema({

  privkey: String,
  cert: String,
  chain: String,
  expiresAt: String,
  issuedAt: String,
  subject: String,
  altnames: String

}));
