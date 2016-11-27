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
      .end();
  }

  authorization = authorization.substr(4);
  jwt.verify(authorization, process.env.PROXY_JWT_SECRET, (error, payload) => {
    if (error) {
      console.log(error.message);

      return response
        .status(500)
        .end();
    }

    if (Date.now() >= payload.expirationAt) {
      return response
        .status(401)
        .end();
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
      .end();
  }

  db.User.findOne({username}, (error, user) => {
    user
      .isPassword(password)
      .then((isCorrect) => {
        if (!isCorrect) {
          return response
            .status(401)
            .end();
        }

        next();
      })

      .catch((error) => {
        response
          .status(500)
          .end();
      });
  });
}

// ----------------------------------------------------------------------------
// exports
module.exports = {
  authenticationJwt,
  authenticationLocal
};
