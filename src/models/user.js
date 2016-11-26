const mongoose = require('mongoose');
const bCrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');
const Log = require('../logger');
const Schema = mongoose.Schema;
const authorisations = require('../schemas/authorisations');

/**
 * User model
 * Used by Proxy
 */
let UserSchema = new Schema({

  username:{
    type: String,
    index: true,
    unique: true,
    required: "You must provide a user name"
  },
  password: {
    type: String,
    set: setPassword,
    required: "You must provide a password"
  },
  firstConnection: {
    type: Date,
    default: null
  },
  lastConnection: {
    type: Date,
    default: new Date()
  },
  mail: {
    type: String
  },
});

/**
 * Compare each Hash
 * return a promise
 * 
 * param {String} password to check
 * return {Boolean}
 */
UserSchema.methods.checkPassword = function(password) {
  
  return new Promise((resolve, reject) => {
    let salt = process.env.PROXY_SALT;
    if (salt === undefined) {
      reject("You must set a PROXY_SALT variable");
    }
    bCrypt.compare(password + salt, this.password, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

/**
 * Hash and store password
 * return true or false
 * 
 * @param {String} password
 * @returns {String} Hashed password
 */
function setPassword (password) {

    let salt = process.env.PROXY_SALT;
    if (salt === undefined) {
      Log.error("You must set a env.PROXY_SALT variable");
      salt = '';
    }

    let hash = bCrypt.hashSync(password + salt, '');
    return hash; 
  }

/**
 * Generate a JWT for a user
 * Take an array of authorisation(Schema) and a Date of expiration
 * @params {Array} Paths
 * @param {Date} Expiration date
 */
UserSchema.methods.generateJwt = function(authorisations, expirationDate) {

  if (process.env.PROXY_JWT_SECRET === undefined) {
    Log.error("You must provide a key to generate JWTs");
    return null;
  }

  if( isNaN(expirationDate) ) {
    expirationDate = expirationDate.getTime();
  }

  return jwt.encode({  
    _id: this._id,
    username: this.username,
    mail: this.mail,
    authorisations: authorisations,
    expiration: expirationDate,
    creation: Date.now()

  }, process.env.PROXY_JWT_SECRET);
}

module.exports = mongoose.model("User", UserSchema);
