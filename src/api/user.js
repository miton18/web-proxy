// ----------------------------------------------------------------------------
// requirements
const router = require('express').Router;
const db = require('../database');
const {authenticationJwt} = require('./authentication');

// ----------------------------------------------------------------------------
// variables
const _router = router();

// ----------------------------------------------------------------------------
// create route to handle /token
_router
  .route('/user')
  .all(authenticationJwt)
  .get((request, response) => {
    db.User.find({}, (error, users) => {
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
