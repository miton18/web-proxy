// ----------------------------------------------------------------------------
// requirements
const router = require('express').Router;
const db = require('../utils/database');
const {authenticationLocal} = require('../middlewares/authentication');
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
            error: "can't check your identity"
          });
      }
      if (!user) {
        return response
          .status(401)
          .json({
            error: "Wrong authentification"
          });
      }
      user.checkPassword(password)
      .then(
        (isCorrect) => {
          Logger.debug("pas d'user", isCorrect);
          if (isCorrect) user.generateJwt({}, Date.now() + 3600 )
          .then(
            (token) => {
              response.json({token});
            },
            (err) => {
              response.json({error: "Can't generate your token"});
            }
          );
          else {
            return response.status(401).json({
              error: "Wrong authentification"
            });  
          }
        },
        (err) => {
          return response.status(401).json({
            error: "Wrong authentification"
          });
        }
      );
    });
  });

// ----------------------------------------------------------------------------
// exports
module.exports = _router;
