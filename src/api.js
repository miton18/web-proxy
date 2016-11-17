let express = require('express');
let compression = require('compression');
let bodyParser = require('body-parser');
let jwt = require('jwt-simple');
let Router = require('./router');
let Log = require('./logger');
let Db = require('./db');

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
 * Auth middleware
***************************/
let tokenHeader = 'x-token'

let protected = (req, res, next) => {

  let token = req.header(tokenHeader);
  if (token !== undefined) {
    let payload = jwt.decode(token, Buffer.from(process.env['PROXY_KEY']));
    if (payload === undefined || payload === null) {
      return res.status(401).json({
        err: `bad token`
      });
    }
    if(payload.expiration < Date.now() && !process.env.NODE_ENV === 'development' ) {
      return res.status(401).json({
        err: `This token is expired since ${new Date(payload.expiration)}`
      });
    }
    // Check permissions  
    /*for(let l of req.route.stack) {
      console.log(l);
    }*/
    next();
  } 
  else {
    res.status(401).json({
      err: 'You need to provide a token' 
    });
  }
};
/*************************** 
 * Params
***************************/
api.param('routeID', (req, res, next, routeID) => {
  req.paramRoute = Router.findRouteById(routeID);
  next();
});

/*************************** 
 * Routes
***************************/ 

api.post('/login', (req, res) => {
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

api.route('/route')
.all(protected)
.get((rq, res) => {
  res.json(Router.routes);
})
.post((req, res) => {
  Router.addRoute(req.body).then(
    (route) => {
      res.json({
        err: null,
        route: route
      });
      Router.loadRoutes();
    },
    (err) => {
      Log.error('Fail to create a route', err, tmpRoute);
      res.json({
        err: 'Fail to create a route',
        route: null
      });
  ;})
})

api.route('/route/:routeID')
.all(protected)
.get((req, res) => {
  // Can use res.route Object
  if (req.paramRoute === null) {
    res.json({
      err: "Route doesn't exist",
      route: null
    });
    return;
  } 
  res.json({
    err: null,
    route: req.paramRoute
  });
})
.put((req, res) => {
  if (req.paramRoute === null) {
    res.json({
      err: "Route doesn't exist",
      route: null
    });
    return;
  } 
  req.paramRoute.subDomain = req.body.subDomain;
  req.paramRoute.active = req.body.active;
  req.paramRoute.destPort = req.body.destPort;
  req.paramRoute.destHost = req.body.destHost;
  Router.editRoute(req.paramRoute).then(
    (route) => {
      res.json({
        err: null,
        route: route
      });
    },
    (err) => {
      res.json({
        err: "Can't save new properties",
        route: null,
      });
    }
  );
})
.delete((req, res) => {
  Router.removeRoute(req.paramRoute).then(
    () => {
      res.json({
        err: null,
        route: req.paramRoute
      });
    },
    (err) => {
      res.json({
        err: "Fail to remove route",
        route: null
      });
    }
  );
});

api.route('/log')
.all(protected)
.get((req, res) => {
  require(mongoose).coll
});

api.route('/user')
.all(protected)
.get((req, res) => {
  Db.models.User.find({}, (err, users) => {
    if (err) res.json({err: err});
    else res.json(users);
  });
});

module.exports = app;
