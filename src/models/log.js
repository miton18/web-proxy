let mongoose = require('mongoose');
let Schema = mongoose.Schema;
/**
 * Log model
 * This is the model used by Winston only change it with Winston update
 */
module.exports = mongoose.model("Log", new Schema({

  timestamp: {
    type: Date,
    required: "Need a TS"
  },
  message: {
    type: String,
    required: "Logging without logging message?"
  },
  level: {
    type: String,
    required: "Need a logging level"
  },
  meta: {
    type: Object
  }
}));
