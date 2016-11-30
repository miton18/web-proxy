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
      logger.info('Set uncaught exception event handler');
      process.removeListener('uncaughtException', this.uncaughtException);
      process.addListener('uncaughtException', this.uncaughtException);

      logger.info('Set unhandled rejection event handler');
      process.removeListener('unhandledRejection', this.unhandledRejection);
      process.addListener('unhandledRejection', this.unhandledRejection);

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
  }

}

// ----------------------------------------------------------------------------
// exports
module.exports = EventsHandler;
