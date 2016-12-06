// ----------------------------------------------------------------------------
// requirements
const async = require('async');

// ----------------------------------------------------------------------------
/**
 * class Application that initialize the application
 */
class Application {

  /**
   * constructor
   */
  constructor() {
    this.components = [];
  }

  /**
   * register a component must have a initialize method
   * @param {any} component that implements
   * @return {Application} this
   */
  register(component) {
    this.components.push(component);

    return this;
  }

  /**
   * launch the application
   * @return {Promise<Number>} the promise is trigger when the application run the number
   * is the time duration of the launchment
   */
  initialize() {
    let start = Date.now();

    return new Promise((resolve, reject) => {
      let rejected = false;
      let error;
      let q = async.queue(function(component, callback) {
        component
          .initialize()
          .then(callback)
          .catch(callback);
      }, 1);

      for (const component of this.components) {
        q.push(component, (err) => {
          if (err) {
            rejected = true;
            error = err;
          }
        });
      }

      q.drain = function() {
        if (rejected) {
          return reject(error);
        }

        resolve(Date.now() - start);
      };
    });
  }
}

// ----------------------------------------------------------------------------
// exports
module.exports = Application;
