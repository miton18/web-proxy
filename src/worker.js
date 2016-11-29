// ----------------------------------------------------------------------------
// requirements
const Application     = require('./application');
const EventsHandler   = require('./events');
const db              = require('./database');
const logger          = require('./logger');
const Router          = require('./router');
const Api             = require('./api');

/**
 * class Worker
 */
class Worker {

  /**
   * start the worker
   */
  start() {
    // ----------------------------------------------------------------------------
    // variables
    const application = new Application();

    // ----------------------------------------------------------------------------
    /**
     * register component remenber a component does implements a methods whose
     * name is initialize that return a promise
     * Don't forget order is important
     */
    application
      .register(new EventsHandler())
      .register(db)
      .register(Router)
      .register(new Api());

    // ----------------------------------------------------------------------------
    // launch the application
    application
      .initialize()
      .then((duration) => {
        logger.info(`Application start in ${duration}ms`);
      })
      .catch((error) => {
        logger.error(error.message);
      });
  }

  /**
   * Return an instance of Singleton
   * @return {Worker}
   */
  static getInstance() {
    if(!(Worker.instance instanceof Worker))
      Worker.instance = new Worker();
    return Worker.instance;
  }
}

// ----------------------------------------------------------------------------
// exports
module.exports = Worker.getInstance();
