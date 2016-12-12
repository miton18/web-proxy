// ----------------------------------------------------------------------------
// requirements
const logger = require('../utils/logger');

// ----------------------------------------------------------------------------
// create middleware

/**
 * middleware to use in express application
 * @param {Request} request the request
 * @param {Response} response the response
 * @param {NextFunction} next the next function
 * @return {void}
 */
function trafficLogger(request, response, next) {
  let start = Date.now();

  response.addListener('finish', function() {
    let {protocol, method, httpVersion, url} = request;
    let {statusCode} = response;
    let duration = Date.now() - start;

    protocol = protocol.toUpperCase();
    method = method.toUpperCase();
    httpVersion = httpVersion || '';

    logger.info(`${protocol} ${httpVersion} ${method} ${statusCode} ${duration}ms ${url}`);
  });

  next();
}

// ----------------------------------------------------------------------------
// exports
module.exports = {
  trafficLogger
};
