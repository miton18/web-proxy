// ----------------------------------------------------------------------------
// requirements
const router = require('express').Router;
const {Docker} = require('../utils/docker');
const async = require('async');
const logger = require('../utils/logger');
const {authenticationJwt} = require('../middlewares/authentication');

// ----------------------------------------------------------------------------
// create router
const _router = router();

// ----------------------------------------------------------------------------
// handle route /
_router
  .route('/')
  .all(authenticationJwt)
  .get(function(request, response) {
    Docker
      .list()
      .then((dockers) => {
        async.map(dockers, (docker, done) => {
          docker
            .information()
            .catch(done)
            .then((information) => {
              done(null, information);
            });
        }, (error, dockers) => {
          if (error) {
            logger.error(error.message);

            return response
              .status(500)
              .json({error: error.message});
          }

          response.json({dockers});
        });
      })

      .catch((error) => {
        response
          .status(500)
          .json({error: error.message});
      });
  })

  .post(function(request, response) {
    Docker
      .run(request.body)
      .then((docker) =>  {
        response
          .status(201)
          .json({docker});
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
// handle route /:id
_router
  .route('/:id')
  .all(authenticationJwt)
  .get(function(request, response) {
    Docker
      .exists(request.params.id)
      .then((docker) => {
        if (!docker) {
          return response
            .status(404)
            .end();
        }

        return docker.information();
      })

      .then((information) => {
        response.json({docker: information});
      })

      .catch((error) => {
        response
          .status(500)
          .json({error: error.message});
      });
  })

  .delete(function(request, response) {
    Docker
      .exists(request.params.id)
      .then((docker) => {
        if (!docker) {
          return response
            .status(404)
            .end();
        }

        return docker.stop();
      })

      .then((docker) => {
        return docker.remove();
      })

      .then((docker) => {
        response
          .status(200)
          .end();
      })

      .catch((error) => {
        response
          .status(500)
          .json({error: error.message});
      });
  });

// ----------------------------------------------------------------------------
// exports
module.exports = _router;
