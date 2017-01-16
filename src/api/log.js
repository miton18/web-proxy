// ----------------------------------------------------------------------------
// requirements
const eRouter = require('express').Router;
const Db = require('../utils/database');
const Log = require('../utils/logger');
const {authenticationJwt} = require('../middlewares/authentication');

// ----------------------------------------------------------------------------
// variables
const _router = eRouter();

// ----------------------------------------------------------------------------
// create route to handle /route
_router
  .route('/')
  .all(authenticationJwt)
  .get((req, res) => {
    Db.models.Log.count({}, (error, count) => {
      if (error) {
        return json.status(500).json({error});
      }

      res.json({
        logEntries: count
      });
    });
  });

_router.ws('/stream', (ws) => {
  ws.on('message', (token) => {
    // auth
    authenticationJwt({  // Request
      headers: JSON.parse(token)
    }, {  // Response
      status: () => {
        return {
          json: (authResponse) => {
            return ws.send(JSON.stringify(authResponse));
          }
        };
      }
    }, () => { // Next
      ws.send('stream starting...');
      Db.models.Log.find({
        timestamp: {
          $gte: Date.now()
        }
      })
      .tailable()
      .cursor()
      .on('data', (doc) => {
        ws.send(JSON.stringify(doc.toObject()));
      }).on('error', (error) => {
        Log.error('[api][ws] error', error);
      }).on('close', () => {
      });
    });
  });
});

module.exports = _router;
