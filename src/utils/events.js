// ----------------------------------------------------------------------------
// requirements
const logger = require('./logger');
const reporter = require('./reporter');

// ----------------------------------------------------------------------------
/**
 * class EventsHandler
 */
class EventsHandler {

  /**
   * initialize the event handler
   * @return {Promise} trigger when finish to set handler
   */
  initialize() {
    return new Promise((resolve, reject) => {
      process.removeListener('uncaughtException', this.uncaughtException);
      process.addListener('uncaughtException', this.uncaughtException);

      process.removeListener('unhandledRejection', this.unhandledRejection);
      process.addListener('unhandledRejection', this.unhandledRejection);

      logger.info('[event] Override defaults exceptions');
      resolve();
    });
  }

  /**
   * handle uncaughtException
   * @param {Error} error the error thrown
   */
  uncaughtException(error) {
    reporter.incrementMetric('error.uncaught');

    logger.error(error.message, {
      from: 'uncaughtException',
      error: error
    });
    process.exit(1);
  }

  /**
   * handle unhandledRejection
   * @param {String} reason the reason that trigger this event
   * @param {Promise} promise the promise
   */
  unhandledRejection(reason, promise) {
    reporter.incrementMetric('error.rejection');

    logger.error(reason, {
      from: 'unhandledRejection',
      promise: promise
    });
    process.exit(1);
  }

}

// ----------------------------------------------------------------------------
// exports
module.exports = EventsHandler;
