(function() {
  var Routes, domain, http, httpProxy, proxy, routed, routes, winston;

  http = require('http');

  httpProxy = require('http-proxy');

  winston = require('winston');

  Routes = require("./routes.json");

  domain = 'rcdinfo.fr';

  routes = {};

  routed = false;

  proxy = httpProxy.createProxyServer({});

  winston.add(winston.transports.File, {
    filename: 'test.log'
  });

  http.createServer(function(req, res) {
    var fn, hostname, i, len, route;
    hostname = req.headers.host.split(":")[0];
    console.log("Request on " + hostname);
    fn = function(route) {
      var error, error1;
      if ((route.sdom + "." + domain) === hostname) {
        routed = true;
        try {
          proxy.web(req, res, {
            target: "http://localhost:" + route.port
          });
          return winston.log('info', "-> http://localhost:" + route.port);
        } catch (error1) {
          error = error1;
          return winston.log('error', "routage " + error);
        }
      }
    };
    for (i = 0, len = Routes.length; i < len; i++) {
      route = Routes[i];
      fn(route);
    }
    if (!routed) {
      proxy.web(req, res, {
        target: "http://localhost:9999"
      });
      return winston.log('error', "no route for: " + hostname);
    }
  }).listen(80, function() {
    return winston.log('info', "Server started... ###################");
  });

  http.createServer(function(req, res) {
    res.writeHead(418, {
      'Content-Type': 'text/html'
    });
    res.write("Quelque chose me dit que vous ne savez pas ce que vous faites ici, aller je suis gentil <a href=\"http://rcdinfo.fr\">cliquez la</a>.");
    return res.end();
  }).listen(9999);

}).call(this);
