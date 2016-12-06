// ----------------------------------------------------------------------------
// requirements
const EventsHandler   = require('./utils/events');
const db              = require('./utils/database');
const logger          = require('./utils/logger');
const Application     = require('./application');
const Router          = require('./router');
const Api             = require('./api');

/**
 * class Worker
 */
class Worker {

  /**
   * start the worker
   */
  constructor() {
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
        logger.info(`[app] Application start in ${duration}ms`);
      })
      .catch((error) => {
        logger.error(error.message, error);
      });
  }

  /**
   * Return an instance of Singleton
   * @return {Worker} worker instance
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
