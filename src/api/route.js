// ----------------------------------------------------------------------------
// requirements
const router = require('express').Router;
const Router = require('../router');
const db = require('../utils/database');
const {authenticationJwt} = require('../middlewares/authentication');

// ----------------------------------------------------------------------------
// variables
const _router = router();

// ----------------------------------------------------------------------------
// route params
_router.param('_id', (request, response, next, _id) => {
    request.route = Router.findRouteById(_id);
    next();
  })

// ----------------------------------------------------------------------------
// create route to handle /route
_router
  .route('/')
  .all(authenticationJwt)
  .get((request, response) => {
    response.json(
      Router
        .routes
    );
  })
  .post((request, response) => {
    // filter to keep ONLY wanted params
    const {active, host, port, ssl} = request.body;

    Router
      .addRoute({active, host, port, ssl})
      .then((route) => {
        response.json({route});
      })

      .catch((error) => {
        response
          .status(500)
          .end();
      });
  });

// ----------------------------------------------------------------------------
// create route to handle /route/:_id
_router
  .route('/:_id')
  .all(authenticationJwt)
  .get((request, response) => {
    if (!request.route) {
      return response
        .status(404)
        .end();
    }

    response.json({route: request.route});
  })

  .put((request, response) => {
    const {active, host, port, ssl} = request.body;

    request.route.active = active;
    request.route.host = host;
    request.route.port = port;
    request.route.ssl = ssl;

    Router
      .updateRoute(request.route)
      .then((route) => {
        response.json({route: request.route});
      })

      .catch((error) => {
        response
          .status(500)
          .end();
      });
  })

  .delete((request, response) => {
    if (!request.route) {
      return response
        .status(404)
        .end();
    }

    Router
      .removeRoute(request.route)
      .then(() => {
        response
          .status(200)
          .end();
      })

      .catch((error) => {
        response
          .status(500)
          .end();
      });
  });

// ----------------------------------------------------------------------------
// exports
module.exports = _router;
