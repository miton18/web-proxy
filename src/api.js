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
      logger.info('[API] Create API');
      
      this.port = process.env.PROXY_API_PORT || 8080;
      this.application = express();
      this.api = router();

      this.application
        .use(cors())
        .use(methodOverride())
        .use(helmet())
        .use(compression())
        .use(body.json())
        .use(body.urlencoded({extended: true}))
        .use('/api', this.api);

      if (process.env.NODE_ENV !== 'production') {
        this.application.use(morgan('dev'));
      }

      for (const route of routes) {
        logger.info(`[API] Load controller: ${route.name}`);
        
        route.module = require('./api/' + route.name);

        logger.info(`[API] required: ${route.name}`);
        this.api.use(route.mountpoint, route.module);
        logger.info(`[API] Loaded controller: ${route.name}`);
      }

      this.application.listen(this.port, () => {
        logger.info(`[API] Api listen on port ${this.port}`);

        resolve();
      });
    });
  }

}

// ----------------------------------------------------------------------------
// exports
module.exports = Api;
