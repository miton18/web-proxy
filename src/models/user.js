// ----------------------------------------------------------------------------
// requirements
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');

// ----------------------------------------------------------------------------
// create schema

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: 'You must provide a user name',
    unique: true,
    index: true
  },

  salt: {
    // must be initialised with the first password
    type: String,
    required: false
  },

  password: {
    type: String,
    required: 'You must provide a password',
    set: function(password) {
      let pepper = process.env.PROXY_PEPPER;
      if (!this.salt) {
        // generate a random salt here
        this.salt = bcrypt.genSaltSync();
      }
      return bcrypt.hashSync(`${pepper}:${password}`, this.salt);
    }
  },

  mail: {
    type: String,
    required: false
  },

  firstConnection: {
    type: Date,
    required: false
  },
  lastConnection: {
    type: Date,
    default: new Date()
  }
});

// ----------------------------------------------------------------------------
// methods

/**
 * set the password of the user, if no salt exists it will be created. The hash
 * field is sha512 fieldprint
 * @param {String} password the user password
 * @return {Promise<UserModel>} return a promise with the user model in parameter
 */
UserSchema.methods.setPassword = function(password) {
  return new Promise((resolve, reject) => {
    let pepper = process.env.PROXY_PEPPER;

    new Promise((resolve, reject) => {
      if (!this.salt) {
        // generate a random salt here
        bcrypt.genSalt((err, salt) => {
          if (error) {
            return reject(error);
          }
          this.salt = salt;
          return resolve();
        });
      } else
        return resolve();
    }).then(() => {
      // generate a fieldprint with BCrypt
      bcrypt.hash(`${pepper}:${password}`, this.salt, () => {}, (error, password) => {
        if (error) {
          return reject(error);
        }

        this.password = password;
        this.save((error) => {
          if (error) {
            return reject(error);
          }
          resolve(this);
        });
      });
    })
    .catch((err) => {
      reject(err);
    });
  });
};

/**
 * check if the password is correct
 * @param {String} password the user password
 * @return {Promise<boolean>} a boolean if is the correct password
 */
UserSchema.methods.checkPassword = function(password) {
  return new Promise((resolve, reject) => {
    let pepper = process.env.PROXY_PEPPER;

    // generate a fieldprint with sha512
    bcrypt.hash(`${pepper}:${password}`, this.salt, () => {}, (error, hash) => {
      if (error) {
        return reject(error);
      }
      console.debug(this.password, hash);
      resolve(this.password === hash);
    });
  });
};

/**
 * generate a personnal json web token
 * @param {Array<{method: String, path: String}>} authorizations routes an user is able to use
 * @param {Date} expiration the date of expiration of the json web token
 * @return {Promise<String>} a promise that return the token
 */
UserSchema.methods.generateJwt = function(authorizations, expiration) {
  return new Promise((resolve, reject) => {
    const {_id, username, mail} = this;

    let payload = {
      sub: _id,
      username,
      mail,
      authorizations,
      issuer: process.env.PROXY_JWT_ISSUER,
      audience: process.env.PROXY_JWT_AUDIENCE,
      expirationAt: expiration,
      creationAt: Date.now()
    };

    jwt.sign(payload, process.env.PROXY_JWT_SECRET, {}, (error, token) => {
      if (error) {
        return reject(error);
      }

      resolve(token);
    });
  });
};

// ----------------------------------------------------------------------------
// create model from schema
let UserModel = mongoose.model('User', UserSchema);

// ----------------------------------------------------------------------------
// exports
module.exports = UserModel;
