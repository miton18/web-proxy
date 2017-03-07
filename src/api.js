// ----------------------------------------------------------------------------
// requirements
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const body = require('body-parser');
const express = require('express');
const expressWs = require('express-ws');
const fs = require('fs');
const http = require('http');
const https = require('https');
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
    logger.info('[API] Create API');
    this.port = process.env.PROXY_API_PORT || 8080;
    this.portSSL = process.env.PROXY_API_PORT_SSL || 8443;
    this.application = express();
    this.api = router();
    expressWs(this.application);

    return new Promise((resolve) => {
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

      for (let route of routes) {
        this.api.use(route.mountpoint, require('./api/' + route.name));
      }

      let sslOptions = {
        keyPath: process.env.PROXY_SSL_KEY || null,
        certPath: process.env.PROXY_SSL_CERT || null
      };

      http.createServer(this.application).listen(this.port);
      logger.info(`[API] Api listen on port ${this.port}`);

      if (sslOptions.certPath && sslOptions.keyPath) {
        sslOptions.key = fs.readFileSync(sslOptions.keyPath, 'utf8');
        sslOptions.cert = fs.readFileSync(sslOptions.certPath, 'utf8');
        https.createServer(sslOptions, this.application).listen(this.portSSL);
        logger.info(`[API] Api SSL listen on port ${this.portSSL}`);
      }
      resolve();
    });
  }

}

// ----------------------------------------------------------------------------
// exports
module.exports = Api;
