// ----------------------------------------------------------------------------
// requirements
const router = require('express').Router;
const db = require('../database');
const {authenticationJwt} = require('../middlewares/authentication');

// ----------------------------------------------------------------------------
// variables
const _router = router();

// ----------------------------------------------------------------------------
// create route to handle /token
_router
  .route('/')
  .all(authenticationJwt)
  .get((request, response) => {
    db.models.User.find({}, (error, users) => {
      if (error) {
        return response
          .status(500)
          .end();
      }

      response.json({users});
    });
  });

// ----------------------------------------------------------------------------
// exports
module.exports = _router;
