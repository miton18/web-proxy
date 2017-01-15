// ----------------------------------------------------------------------------
// requirements
const fetch = require('node-fetch');
const logger = require('../utils/logger');
const reporter = require('../utils/reporter');

// ----------------------------------------------------------------------------
// middleware

/**
 * execute post request to your warp10 instance
 * @param {Request} request the request
 * @param {Response} response the response
 * @param {NextFunction} next go to next handler
 * @return {void}
 */
function warp10(request, response, next) {
  let start = reporter.getMicroSeconds();

  response.on('finish', function() {
    const {method, baseUrl} = request;
    const {host} = request.headers;
    const {statusCode} = response;
    const labels = [
      {key: 'method', value: method},
      {key: 'url', value: baseUrl},
      {key: 'status', value: statusCode}
    ];

    fetch(`https://freegeoip.net/json/${host}`).then((data) => {
      let {latitude, longitude} = data;
      let duration = reporter.getMicroSeconds() - start;
      let metric = reporter.toWarp10Format('proxy.request', labels, duration, latitude, longitude);

      reporter.sendWarp10Metric(metric);
    })
    .catch((error) => {
      logger.error(error.message);
    });
  });

  if (next) {
    next();
  }
}

// ----------------------------------------------------------------------------
// exports
module.exports = {
  warp10
};
