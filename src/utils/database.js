// ----------------------------------------------------------------------------
// requirements
const path = require('path');
const mongoose = require('mongoose');
const models = require('../settings/models');

// ----------------------------------------------------------------------------
// overload mongoose promise
mongoose.Promise = Promise;

// ----------------------------------------------------------------------------
/**
 * class Database
 */
class Database {

  /**
   * constructor
   */
  constructor() {
    this.models = {};
  }

  /**
   * initialize method
   * @return {Promise} a promise when the object is initialized
   */
  initialize() {
    return new Promise((resolve, reject) => {
      this.loadModels()
      .then(() => {
        mongoose.connect(this.uri, (error) => {
          if (error) {
            return reject(error);
          }
          resolve();
        });
      })
      .catch(reject);
    });
  }

  /**
   * load models from models repertory
   * @return {Promise} a promise when is finish to load
   */
  loadModels() {
    return new Promise((resolve, reject) => {
      let entity;
      for (const {name} of models) {
        entity = name;
        entity = entity.toLowerCase();
        entity = entity.charAt(0).toUpperCase() + entity.substr(1);

        this.models[entity] = require(path.join( __dirname, '../' , 'models', name));
      }

      resolve();
    });
  }

  /**
   * get the instance
   * @return {Database} a Database instance
   */
  static getInstance() {
    if (!(Database.instance instanceof Database)) {
      Database.instance = new Database();
    }

    return Database.instance;
  }

  /**
   * get the user from env
   * @return {String} the mongo user
   */
  get user() {
    return (
      process.env.PROXY_MONGODB_ADDON_USER ||
      process.env.MONGODB_ADDON_USER ||
      null
    );
  }

  /**
   * get the password from env
   * @return {String} the mongo password
   */
  get password() {
    return (
      process.env.PROXY_MONGODB_ADDON_PASSWORD ||
      process.env.MONGODB_ADDON_PASSWORD ||
      null
    );
  }

  /**
   * get the base from env
   * @return {String} the base
   */
  get base() {
    return (
      process.env.PROXY_MONGODB_ADDON_DB ||
      process.env.MONGODB_ADDON_DB ||
      'proxy'
    );
  }

  /**
   * get the host from env
   * @return {String} the host
   */
  get host() {
    return (
      process.env.PROXY_MONGODB_ADDON_HOST ||
      process.env.MONGODB_ADDON_HOST ||
      'localhost'
    );
  }

  /**
   * get the port
   * @return {Number} the port
   */
  get port() {
    return (
      process.env.PROXY_MONGODB_ADDON_PORT ||
      process.env.MONGODB_ADDON_PORT ||
      27017
    );
  }

  /**
   * get the uri from env
   * @return {String} the uri
   */
  get uri() {
    let uri = `mongodb://${this.host}:${this.port}/${this.base}`;
    if (this.user && this.password) {
      uri = `mongodb://${this.user}:${this.password}@${this.host}:${this.port}/${this.base}`;
    }

    return (
      process.env.PROXY_MONGODB_ADDON_URI ||
      process.env.MONGODB_ADDON_URI ||
      uri
    );
  }
}

// ----------------------------------------------------------------------------
// exports
module.exports = Database.getInstance();
