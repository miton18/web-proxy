let express = require('express');
let compression = require('compression');
let bodyParser = require('body-parser');
let passport = require('passport');
let passportJWT = require('passport-jwt');
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
api.use(passport.initialize());
api.use(passport.session());

/*************************** 
 * Auth middleware
***************************/
passport.use(new passportJWT.Strategy({
  secretOrKey: "aaa",
  jwtFromRequest: passportJWT.ExtractJwt.fromHeader("X-Token")
}, 
(jwtPayload, cb) => {
  console.log("use");
  console.log(payload);
  return cb(null, {ID: username, password: password});
}));

passport.serializeUser(function(user, cb) {
  console.log("serialize");
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  console.log("deserialize");

  cb(null, new (Db.models.user)());
});


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
  //Db.models.User.remove({}, (err) => {});
  /*let tmp = new (Db.models.User)({
    username: "miton",
    mail: "miton@rcdinfo.fr",
    password: "miton"
  }).save((err) => {console.log(err)});*/
  if (req.body.username === undefined || req.body.password === undefined) {
    return res.json({
      err: "Please send a 'username' and a 'password'",
      token: null
    });
  }
  Db.models.User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err || !user) {
      Log.error(err, req.body);
      return res.json({err: "This username doesn't exist", token: null});
    }
    user.checkPassword(req.body.password).then(
      (isGoodPassword) => {
        if (!isGoodPassword) {
          res.json({
            err: "Bad password", 
            token: null
          });
        } else {
          res.json({
            err: null,
            token: user.generateJwt([], new Date().setHours( new Date().getHours() + 1 ) )
          });
        }
      },
      (err) => {
        res.json({err: err, token: null});
      }
    );
  });
});

app.get('/200', (req, res) => {
  res.status(200).json({err: null, message: "It's fine !"});
});

api.get('/check', (req, res) => {
  res.json({});
});

api.route('/route')
//.all(protected)
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
//.all(protected)
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
//.all(protected)
.get((req, res) => {
  require(mongoose).coll
});

api.route('/user')
.get((req, res) => {
  Db.models.User.find({}, (err, users) => {
    if (err) res.json({err: err});
    else res.json(users);
  });
});

module.exports = app;
