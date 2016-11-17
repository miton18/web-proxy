let mongoose = require('mongoose');
let Schema = mongoose.Schema;
/**
 * Route model
 * Used by Proxy
 */
module.exports = mongoose.model("Route", new Schema({

  active: {
    type: Boolean,
    default: true
  },
  subDomain: {
    type: String,
    required: "You must provide a domain for a route"
  },
  destPort: {
    type: Number,
    required: "You must provide a port for a route"
  },
  destHost: {
    type: String,
    default: "127.0.0.1"
  },
  forwardSSL: {
    type: Boolean,
    default: false
  }
}));
