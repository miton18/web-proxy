// ----------------------------------------------------------------------------
// requirements
const mongoose = require('mongoose');

// ----------------------------------------------------------------------------
// create schema
let RouteSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: true
  },

  port: {
    type: String,
    required: true
  },

  host: {
    type: String,
    required: true
  },

  ssl: {
    type: Boolean,
    default: false
  }
});

// ----------------------------------------------------------------------------
// create model from schema
let RouteModel = mongoose.model('Route', RouteSchema);

// ----------------------------------------------------------------------------
// export model
module.exports = RouteModel;
