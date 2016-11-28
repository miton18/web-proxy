// ----------------------------------------------------------------------------
// requirements
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const body = require('body-parser');
const express = require('express');
const router = express.Router;
const path = require('path');
const morgan = require('morgan');
const logger = require('./logger');
const methodOverride = require('method-override');
const routes = require('./settings/routes');

// ----------------------------------------------------------------------------
/**
 * class API
 */
class Api {

  /**
   * initialize the api
   * @return {Promise<Object>} when the api is lauched
   */
  initialize() {
    return new Promise((resolve, reject) => {
      logger.info('Create API');
      let application = express();
      let api = router();

      application
        .use(cors())
        .use(methodOverride())
        .use(helmet())
        .use(compression())
        .use(body.json())
        .use(body.urlencoded({extended: true}));

      if (process.env.NODE_ENV !== 'production') {
        application.use(morgan('dev'));
      }

      logger.info(`Load controllers files on directory controllers`);
      for (const route of routes) {
        logger.info(`Load controller: ${route.name}`);
        api.use(route.mountpoint, require(
            path.join(__dirname, 'api', route.name)
          )
        );
      }

      application.use('/api', api);
      application.listen(process.env.PROXY_API_PORT || 8080, () => {
        logger.info(`Api listen on port ${process.env.PROXY_API_PORT || 8080}`);

        resolve();
      });
    });
  }

}

// ----------------------------------------------------------------------------
// exports
module.exports = Api;
