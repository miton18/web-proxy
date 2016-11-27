// ----------------------------------------------------------------------------
// requirements
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const body = require('body-parser');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const logger = require('./logger');
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

      application
        .use(cors())
        .use(helmet())
        .use(compression())
        .use(morgan('dev'))
        .use(body.json())
        .use(body.urlencoded({extended: true}));

      logger.info(`Load controllers files on directory controllers`);

      for (const route of routes) {
        logger.info(`Load controller: ${route.name}`);
        application.use(route.mountpoint, require(
            path.join(__dirname, 'api', route.name)
          )
        );
      }

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
