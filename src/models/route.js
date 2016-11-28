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

  domain: {
    type: String,
    required: 'You must provide a domain for a route'
  },

  port: {
    type: Number,
    required: 'You must provide a port for a route'
  },

  host: {
    type: String,
    required: 'You must provide a host for a route',
    default: '127.0.0.1'
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
