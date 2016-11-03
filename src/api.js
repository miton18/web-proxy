let express = require('express');
let compression = require('compression');
let bodyParser = require('body-parser')
let Router = require('./router');
let Log = require('./logger');

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
api.all('/*', (req, res, next) => {
  Log.warn('need to be auth');
  next();
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
// PUBLIC 
app.get('/200', (req, res) => {
  res.status(200).json({err: null, message: "It's fine !"});
});

// PRIVATE
api.get('/check', (req, res) => {
  res.json({});
});

api.route('/route')
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
.get((req, res) => {
  require(mongoose).coll
});

module.exports = app;