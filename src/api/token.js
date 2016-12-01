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
  //.all(authenticationLocal) => on authentifie pas la route pour se logger
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
            error: "This user doesn't exist"
          });
      }
      user.checkPassword(password)
      .then(
        (isCorrect) => {
          if (isCorrect) user.generateJwt({}, Date.now() + 3600 * 12)
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
