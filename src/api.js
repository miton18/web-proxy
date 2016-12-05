// ----------------------------------------------------------------------------
// requirements
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const body = require('body-parser');
const express = require('express');
const router = express.Router;
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

      for (const route of routes)
        this.api.use(route.mountpoint, require('./api/' + route.name));

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
