// ----------------------------------------------------------------------------
// requirements
const Application = require('./application');
const EventsHandler = require('./events');
const db = require('./database');
const logger = require('./logger');
const Router = require('./router');
const Api = require('./api');

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
  .then(function(duration) {
    logger.info(`Application start in ${duration}ms`);
  })
  .catch(function(error) {
    logger.error(error.message);
  });
