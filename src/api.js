// ----------------------------------------------------------------------------
// requirements
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const body = require('body-parser');
const express = require('express');
const expressWs = require('express-ws');
const router = express.Router;
const logger = require('./utils/logger');
const methodOverride = require('method-override');
const routes = require('./settings/routes');
const {trafficLogger} = require('./middlewares/http-logger');
const {warp10} = require('./middlewares/warp10');

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
    return new Promise((resolve) => {
      logger.info('[API] Create API');

      this.port = process.env.PROXY_API_PORT || 8080;
      this.application = express();
      this.api = router();
      expressWs(this.application);

      this.application
        .use(cors())
        .use(methodOverride())
        .use(helmet())
        .use(compression())
        .use(body.json())
        .use(body.urlencoded({extended: true}))
        .use(trafficLogger)
        .use(warp10)
        .use('/api', this.api);

      if (process.env.PROXY_DOCKER_SOCKET) {
        this.api.use('/container', require('./api/container'));
      }

      for (let route of routes) {
        this.api.use(route.mountpoint, require('./api/' + route.name));
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
