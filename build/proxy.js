(function() {
  var Logger, Route, Router, api, bodyParser, express, fs, gui, http, https, router;

  http = require('http');

  https = require('https');

  fs = require('fs');

  express = require('express');

  bodyParser = require('body-parser');

  Router = require('./router.js');

  Route = require('./route.js');

  Logger = require('./logger');


  /*certs =
       key: fs.readFileSync '/etc/letsencrypt/live/rcdinfo.fr/privkey.pem'
       cert: fs.readFileSync '/etc/letsencrypt/live/rcdinfo.fr/cert.pem'
   */

  router = new Router('local.dev', 'http://remi.rcdinfo.fr/');

  router.loadRoutes();

  http.createServer(router.getApp).listen(80, function() {
    return Logger.log('info', "Server started http ... ");
  });


  /*https.createServer certs, router.getApp()
  .listen 443, ->
      winston.log 'info', "Server started https ... "
   */

  api = express.Router();

  gui = express();

  gui.use(bodyParser());

  gui.use('/', express["static"]('public'));

  gui.use('/api', api);

  api.route('/routes').get(function(req, res) {
    return router.getAllRoutes(function(err, routes) {
      if (err != null) {
        return Logger.log('error', 'no connexion with Mongo client', {
          error: err
        });
      }
      return res.json(routes);
    });
  }).post(function(req, res) {
    var ref, ref1, tmpRoute;
    if (!((((ref = req.body) != null ? ref.subDomain : void 0) != null) && (((ref1 = req.body) != null ? ref1.destPort : void 0) != null))) {
      return res.json({
        err: 'bad parameters'
      });
    }
    tmpRoute = new Route(req.body);
    return tmpRoute.save(function(err, result) {
      return res.json({
        err: err,
        result: JSON.parse(result).n === 1,
        route: tmpRoute
      });
    });
  });

  api.route('/routes/:_id').put(function(req, res) {
    var tmpRoute;
    req.body['_id'] = req.params._id;
    tmpRoute = new Route(req.body);
    return tmpRoute.save(function(err, result) {
      return res.json({
        err: err,
        result: JSON.parse(result).nModified === 1,
        route: tmpRoute
      });
    });
  })["delete"](function(req, res) {
    var tmp;
    tmp = new Route(req.params);
    return tmp["delete"](function(err, result) {
      return res.json({
        err: err,
        result: JSON.parse(result).n === 1
      });
    });
  });

  gui.listen(9999, function() {
    return console.log('GUI started');
  });

}).call(this);
