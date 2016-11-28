// ----------------------------------------------------------------------------
// requirements
const mongoose = require('mongoose');

// ----------------------------------------------------------------------------
// create schema
let ConfigSchema = new mongoose.Schema({
  host: String,
  traceKey: String,
  traceName: String,
  traceActive: Boolean
});

// ----------------------------------------------------------------------------
// create model from schema
let ConfigModel = mongoose.model('Config', ConfigSchema);

// ----------------------------------------------------------------------------
// exports model
module.exports = ConfigModel;
