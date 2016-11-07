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
    let salt = process.env.salt;
    if (salt === undefined) {
      reject("You must set a env.salt variable");
    }
    bCrypt.compare(password, this.password, (err, res) => {
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
 */
function setPassword (password) {

    let salt = process.env.salt;
    if (salt === undefined) {
      Log.error("You must set a env.salt variable");
    }
    return bCrypt.hashSync(password, process.env.salt, console.log)    
  }

/**
 * Generate a JWT for a user
 * Take an array of authorisation(Schema) and a Date of expiration
 */
UserSchema.methods.generateJwt = function(authorisations, expirationDate) {

  if (process.env.key === undefined) {
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

  }, process.env.key);
}

module.exports = mongoose.model("User", UserSchema);