// ----------------------------------------------------------------------------
// requirements
const jwt = require('jsonwebtoken');
const db = require('../database');

// ----------------------------------------------------------------------------
// middlewares

/**
 * set middleware that handle jwt authorization
 * @param {any} request the request
 * @param {any} response the response
 * @param {Function} next go to next handler
 * @return {void} void
 */
function authenticationJwt(request, response, next) {
  let {authorization} = request.headers;

  if (!/^JWT [\w\d\.\-_]+$/.test(authorization)) {
    return response
      .status(401)
      .json({error: new Error('Wrong authorization')});
  }

  let options = {
    algorithms: ['HS256', 'HS358', 'HS512'],
    audience: process.env.PROXY_JWT_AUDIENCE,
    issuer: process.env.PROXY_JWT_ISSUER,
    ignoreExpiration: false,
    clockTolerance: 0
  };

  authorization = authorization.substr(4);
  jwt.verify(authorization, process.env.PROXY_JWT_SECRET, options, (error, payload) => {
    if (error) {
      return response
        .status(500)
        .json({error});
    }

    if (Date.now() >= payload.expirationAt) {
      return response
        .status(401)
        .json({error: new Error('Expiration date')});
    }

    next();
  });
}

/**
 * set middleware that handle local authorization
 * @param {any} request the request
 * @param {any} response the response
 * @param {Function} next go to next handler
 * @return {void} void
 */
function authenticationLocal(request, response, next) {
  const {username, password} = request.body;

  if (!username || !password) {
    return response
      .status(401)
      .json({error: new Error('Wrong identifier')});
  }

  db.models.User.findOne({username}, (error, user) => {
    user
      .checkPassword(password)
      .then((isCorrect) => {
        if (!isCorrect) {
          return response
            .status(401)
            .json({error: new Error('Password is invalid')});
        }

        next();
      })

      .catch((error) => {
        response
          .status(500)
          .json({error});
      });
  });
}

// ----------------------------------------------------------------------------
// exports
module.exports = {
  authenticationJwt,
  authenticationLocal
};
