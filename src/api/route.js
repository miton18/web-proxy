// ----------------------------------------------------------------------------
// requirements
const router = require('express').Router;
const Router = require('../router');
const db = require('../database');
const {authenticationJwt} = require('./authentication');

// ----------------------------------------------------------------------------
// variables
const _router = router();

// ----------------------------------------------------------------------------
// create route to handle /route
_router
  .route('/route')
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
  .route('/route/:_id')
  .all(authenticationJwt)
  .get((request, response) => {
    const {_id} = request.body;
    const route = Router
        .findRouteById(_id);

    if (!route) {
      return response
        .status(404)
        .end();
    }

    response.json({route});
  })

  .put((request, response) => {
    const {_id, active, host, port, ssl} = request.body;
    const route = new db.Route({_id, active, host, port, ssl});

    Router
      .updateRoute(route)
      .then((route) => {
        response.json({route});
      })

      .catch((error) => {
        response
          .status(500)
          .end();
      });
  })

  .delete((request, response) => {
    const {_id} = request.body;
    const route = Router
      .findRouteById(_id);

    if (!route) {
      return response
        .status(404)
        .end();
    }

    Router
      .removeRoute(route)
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
