// ----------------------------------------------------------------------------
// requirements
const mongoose = require('mongoose');

// ----------------------------------------------------------------------------
// create schema
let CertificateSchema = new mongoose.Schema({
  privkey: String,
  cert: String,
  chain: String,
  expiresAt: String,
  issuedAt: String,
  subject: String,
  altnames: String
});

// ----------------------------------------------------------------------------
// create model from schema
let CertificateModel = mongoose.model('Certificate', CertificateSchema);

// ----------------------------------------------------------------------------
// exports model
module.exports = CertificateModel;
