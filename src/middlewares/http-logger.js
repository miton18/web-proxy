// ----------------------------------------------------------------------------
// requirements
const logger = require('../utils/logger');
const colors = require('colors');

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

    if (statusCode < 200) {
      statusCode = colors.blue(statusCode);
    } else if (statusCode < 300) {
      statusCode = colors.green(statusCode);
    } else if (statusCode < 400) {
      statusCode = colors.yellow(statusCode);
    } else {
      statusCode = colors.red(statusCode);
    }

    if (duration < 100) {
      duration = colors.blue(duration);
    } else if (duration < 200) {
      duration = colors.green(duration);
    } else if (duration < 500) {
      duration = colors.yellow(duration);
    } else {
      duration = colors.red(duration);
    }

    logger.silly(`${protocol} ${httpVersion} ${method} ${statusCode} ${duration} ms ${url}`);
  });

  next();
}

// ----------------------------------------------------------------------------
// exports
module.exports = {
  trafficLogger
};
