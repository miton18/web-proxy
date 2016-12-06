// ----------------------------------------------------------------------------
// requirements
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ----------------------------------------------------------------------------
// create schema
const LogSchema = new Schema({
  timestamp: {
    type: Date,
    required: 'You must provide a timestamp'
  },

  message: {
    type: String,
    required: 'You must provide a message'
  },

  level: {
    type: String,
    required: 'You must provide a logging level'
  },

  meta: {
    type: Object
  }
});

// ----------------------------------------------------------------------------
// create model
const Log = mongoose.model('Log', LogSchema);

// ----------------------------------------------------------------------------
// exports
module.exports = Log;
