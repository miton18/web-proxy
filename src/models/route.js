let mongoose = require('mongoose');
let Schema = mongoose.Schema;

/**
 * Route model
 * Used by Proxy
 */
module.exports = mongoose.model("Route", new Schema({

  active: Boolean,
  subDomain: String,
  destPort: Number,
  destHost: String

}));
