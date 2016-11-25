let express = require('express');
let compression = require('compression');
let bodyParser = require('body-parser');
let jwt = require('jwt-simple');
let Router = require('./router');
let Log = require('./logger');
let Db = require('./db');
let protected = require('./controller/auth'); // Just an handler

let app = express();
let api = express.Router();

/*************************** 
 * USES
***************************/
app.use('/api', api);
app.use(compression());
app.use(bodyParser.json());
api.use(compression());
api.use(bodyParser.json());

/*************************** 
 * Params
***************************/

/*************************** 
 * Routes
***************************/ 

api.post('/token', (req, res) => {
  let body = {
    err: null,
    token: null
  };
  if (req.body.username === undefined || req.body.password === undefined) { 
      body.err = "Please send a 'username' and a 'password'";
      res.json(401, body);
  }
  else {
    Db.models.User.findOne({
      username: req.body.username
    }, (err, user) => {
      if (err || !user) {
        Log.error(err || "user doesn't exist", req.body);
        body.err = "This username doesn't exist";
        res.status(401).json(body);
      } 
      else {
        user.checkPassword(req.body.password).then(
          (isGoodPassword) => {
            if (!isGoodPassword) {
              body.err = 'Bad password';
              res.json(401, body);
            } 
            else {
              body.token = user.generateJwt([], new Date().setHours( new Date().getHours() + 1 ) )
              res.json(body);
            }
          },
          (err) => {
            body.err = err;
            res.json(body);
          });
      }
    });
  }
});

app.get('/200', (req, res) => {
  res.status(200).json({err: null, message: "It's fine !"});
});

api.get('/check', (req, res) => {
  res.json({});
});

api.use('/route', require('./controller/route'));
api.use('/log', require('./controller/log'));

api.route('/user')
.all(protected)
.get((req, res) => {
  Db.models.User.find({}, (err, users) => {
    if (err) res.json({err: err});
    else res.json(users);
  });
});

module.exports = app;
