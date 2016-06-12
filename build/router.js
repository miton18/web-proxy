(function() {
  var Logger, Route, Router, db, httpProxy,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  httpProxy = require('http-proxy');

  Route = require('./route');

  Logger = require('./logger');

  db = require('./db');

  module.exports = Router = (function() {
    Router.prototype.routes = [];

    function Router(host, defaultURL) {
      this.host = host;
      this.defaultURL = defaultURL;
      this.getApp = bind(this.getApp, this);
      this.getAllRoutes = bind(this.getAllRoutes, this);
      this.getRoutes = bind(this.getRoutes, this);
      this.loadRoutes = bind(this.loadRoutes, this);
      this.proxy = httpProxy.createProxyServer({});
    }

    Router.prototype.loadRoutes = function() {
      return db((function(_this) {
        return function(err, db) {
          if (err != null) {
            return console.log(err);
          }
          return db.collection('route').find({
            active: true
          }).toArray(function(err, routes) {
            var i, len, r;
            if (err != null) {
              return Logger.log('error', 'no connexion with Mongo client', {
                error: err
              });
            }
            for (i = 0, len = routes.length; i < len; i++) {
              r = routes[i];
              _this.routes.push(new Route(r));
            }
            return _this.routes.push(new Route({
              subDomain: 'manager',
              destPort: 9999,
              destHost: '127.0.0.1',
              active: true,
              forwardSSL: false
            }));
          });
        };
      })(this));
    };

    Router.prototype.getRoutes = function() {
      return this.routes;
    };

    Router.prototype.getAllRoutes = function(cb) {
      return db((function(_this) {
        return function(err, db) {
          if (err != null) {
            return console.log(err);
          }
          return db.collection('route').find().toArray(function(err, routes) {
            return cb(err, routes);
          });
        };
      })(this));
    };

    Router.prototype.getApp = function(req, res) {
      var fn, i, len, ref, ref1, reqHostname, route;
      reqHostname = (req != null ? (ref = req.headers) != null ? ref.host : void 0 : void 0) != null ? req.headers.host.split(":")[0] : null;
      ref1 = this.routes;
      fn = (function(_this) {
        return function(route) {
          if (route.subDomain + '.' + _this.host === reqHostname) {
            return _this.link = route.getLink();
          }
        };
      })(this);
      for (i = 0, len = ref1.length; i < len; i++) {
        route = ref1[i];
        fn(route);
      }
      if (this.link == null) {
        this.link = this.defaultURL;
        Logger.log('error', 'no route for subdomain', {
          'requested': reqHostname
        });
      }
      this.proxy.web(req, res, {
        target: this.link
      });
      this.link = null;
      return this.proxy.on('error', function(err, req, res) {
        Logger.log('error', 'proxy error', {
          error: err
        });
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        return res.end('500: Internal Server Error');
      });
    };

    return Router;

  })();

}).call(this);
