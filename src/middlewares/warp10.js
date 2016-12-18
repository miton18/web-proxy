// ----------------------------------------------------------------------------
// requirements
const fetch = require('node-fetch');
const logger = require('../utils/logger');

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
  let start = Date.now();

  response.on('finish', function() {
    const {method, url} = request;
    const {host} = request.headers;
    const {statusCode} = response;
    const uri = process.env.PROXY_WARP10_URI;
    const token = process.env.PROXY_WARP10_WRITE_TOKEN;
    const labels = [
      {key: 'method', value: method},
      {key: 'url', value: url},
      {key: 'status', value: statusCode}
    ];

    fetch(`http://freegeoip.net/json/${host}`).then((data) => {
      const {latitude, longitude} = data;
      const duration = Date.now() - start;
      const body = warp10Format('proxy.request', labels, duration, latitude, longitude);

      return fetch(`${uri}/api/v0/update`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Warp10-Token': token
        },

        body
      });
    })

    .catch((error) => {
      logger.error(error.message);
    });
  });

  if (next) {
    next();
  }
}

/**
 * format a string to send to warp10 instance
 * @param {string} name the name of the metric
 * @param {Object} labels the name of labels
 * @param {any} value the value of the metric
 * @param {number?} latitude the latitude
 * @param {longitude?} longitude the longitude
 * @param {elevation?} elevation the elevation
 * @return {string} a beautiful string to send
 */
function warp10Format(name, labels, value, latitude, longitude, elevation) {
  elevation = elevation || '';

  let position = '';
  if (latitude && longitude) {
    position = `${latitude}:${longitude}`;
  }

  labels = labels.map((label) => `${label.key}=${label.value}`);

  return `${Date.now()}000000/${position}/${elevation} ${name}{${labels.join(',')}} ${value}`;
}

// ----------------------------------------------------------------------------
// exports
module.exports = {
  warp10,
  warp10Format
};
