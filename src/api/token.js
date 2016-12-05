// ----------------------------------------------------------------------------
// requirements
const router = require('express').Router;
const db = require('../utils/database');
const Logger = require('../utils/logger');

// ----------------------------------------------------------------------------
// variables
const _router = router();

// ----------------------------------------------------------------------------
// create route to handle /token
_router
  .route('/')
  .post((request, response) => {
    const {username, password} = request.body;

    db.models.User.findOne({username}, (error, user) => {
      if (error) {
        return response
          .status(500)
          .json({
            error: `can't check your identity`
          });
      }

      if (!user) {
        return response
          .status(401)
          .json({
            error: `Wrong authentification`
          });
      }

      user
      .checkPassword(password)
      .then((isCorrect) => {
        if (!isCorrect) {
          return response
            .status(401)
            .json({
              error: 'Wrong authentification'
            });
        }

        user.generateJwt({}, Date.now() + 60 * 60 * 1000 ) // ms
          .then((token) => {
            user.lastConnection = new Date();

            if (!user.firstConnection)
              user.firstConnection = user.lastConnection;

            user.save((err) => {
              if (err) {
                Logger.error(`[user] fail to save last connection date`, user);
              }
            });

            response.json({token});
          })

          .catch((err) => {
            response.json({error: `Can't generate your token`});
          });
      })

      .catch((err) => {
        response.status(401).json({
          error: 'Wrong authentification'
        });
      });
    });
  });

// ----------------------------------------------------------------------------
// exports
module.exports = _router;
