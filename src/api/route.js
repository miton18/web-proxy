// ----------------------------------------------------------------------------
// requirements
const eRouter = require('express').Router;
const Router = require('../router');
const {authenticationJwt} = require('../middlewares/authentication');
const Logger = require('../utils/logger');

// ----------------------------------------------------------------------------
// variables
const _router = eRouter();

// ----------------------------------------------------------------------------
// route params
_router.param('_id', (request, response, next, _id) => {
  request.proxyRoute = Router.findRouteById(_id);
  next();
});

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
    const {active, domain, host, path, port, ssl} = request.body;
    Router
      .addRoute({active, domain, path, host, port, ssl})
      .then((route) => {
        response.json(route);
        Logger.info('New route', route.toObject());
      },
      (error) => {
        response
          .status(500)
          .json(error);
      });
  });

// ----------------------------------------------------------------------------
// create route to handle /route/:_id
_router
  .route('/:_id')
  .all(authenticationJwt)
  .get((request, response) => {
    if (!request.proxyRoute) {
      return response
        .status(404)
        .json({error: 'Route not found'});
    } else {
      return response
        .json(request.proxyRoute);
    }
  })

  .put((request, response) => {
    if (!request.proxyRoute) {
      return response
        .status(500)
        .json({error: 'Route not exist'});
    }
    const {active, domain, path, host, port, ssl} = request.body;

    request.proxyRoute.active = active;
    request.proxyRoute.host = host;
    request.proxyRoute.port = port;
    request.proxyRoute.ssl = ssl;
    request.proxyRoute.domain = domain;
    request.proxyRoute.path = path;

    Router
      .updateRoute(request.proxyRoute)
      .then(() => {
        response.json(request.proxyRoute);
      })

      .catch((error) => {
        response
          .status(500)
          .json({
            error: error.message
          });
      });
  })

  .delete((request, response) => {
    if (!request.proxyRoute) {
      return response
        .status(404)
        .end();
    }

    Router
      .removeRoute(request.proxyRoute)
      .then(() => {
        response
          .status(200)
          .json(request.proxyRoute);
        Logger.info('Remove route', request.proxyRoute.toObject());
      })

      .catch((error) => {
        response
          .status(500)
          .json({
            error: error.message
          });
      });
  });

// ----------------------------------------------------------------------------
// exports
module.exports = _router;
