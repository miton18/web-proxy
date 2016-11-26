
const express = require('express');
const http = require('http');
const protected = require('../auth');
const Router = require('../router');
const R = express.Router();

// Apply on '/api/route/...'
R.param('routeID', (req, res, next, routeID) => {
  req.paramRoute = Router.findRouteById(routeID);
  next();
});

R.route('/')
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

R.route('/:routeID')
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

module.exports = R;