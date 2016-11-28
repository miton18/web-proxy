// ----------------------------------------------------------------------------
// requirements
const router = require('express').Router;
const db = require('../database');
const {authenticationLocal} = require('../middlewares/authentication');

// ----------------------------------------------------------------------------
// variables
const _router = router();

// ----------------------------------------------------------------------------
// create route to handle /token
_router
  .route('/')
  .all(authenticationLocal)
  .post((request, response) => {
    const {username, password} = request.body;

    db.User.findOne({username, password}, (error, user) => {
      if (error) {
        return response
          .status(500)
          .end();
      }

      if (!user) {
        return response
          .status(401)
          .end();
      }

      response.json({
        body: user.generateJwt({}, Date.now() + 3600 * 12)
      });
    });
  });

// ----------------------------------------------------------------------------
// exports
module.exports = _router;
