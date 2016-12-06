// ----------------------------------------------------------------------------
// requirements
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
    THIS MODEL is jsut a wrapper to get logs
    Winston must be the only documents creator.
*/

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
}, {
  // Keep sync with logger
  capped: {
    size: 400000000, // In bytes (400M)
    max: 1000000, // max 1000000 (documents)
    autoIndexId: true
  }
});

// ----------------------------------------------------------------------------
// create model
const Log = mongoose.model('Log', LogSchema);

// ----------------------------------------------------------------------------
// exports
module.exports = Log;
