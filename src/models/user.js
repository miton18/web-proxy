let mongoose = require('mongoose');
let bCrypt = require('bcrypt-nodejs');
let jwt = require('jwt-simple');
let Log = require('../logger');
let Schema = mongoose.Schema;
let authorisations = require('../schemas/authorisations');

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
 * @param String password
 * @returns
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
 */
UserSchema.methods.generateJwt = function(authorisations, expirationDate) {

  if (process.env.PROXY_KEY === undefined) {
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

  }, process.env.PROXY_KEY);
}

module.exports = mongoose.model("User", UserSchema);
