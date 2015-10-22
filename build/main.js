(function() {
  var Routes, domain, http, httpProxy, proxy, winston;

  http = require('http');

  httpProxy = require('http-proxy');

  winston = require('winston');

  Routes = require("./routes.json");

  domain = 'rcdinfo.fr';

  proxy = httpProxy.createProxyServer({});

  winston.add(winston.transports.File, {
    filename: 'access.log'
  });

  http.createServer(function(req, res) {
    var fn, hostname, i, len, route;
    hostname = req.headers.host.split(":")[0];
    winston.log('info', "Request on " + hostname);
    fn = (function(_this) {
      return function(route) {
        if ((route.sdom + "." + domain) === hostname) {
          return Routes.link = "http://localhost:" + route.port;
        }
      };
    })(this);
    for (i = 0, len = Routes.length; i < len; i++) {
      route = Routes[i];
      fn(route);
    }
    if (Routes.link == null) {
      Routes.link = "http://localhost:9000";
      winston.log('error', "no route for: " + hostname);
    }
    proxy.web(req, res, {
      target: Routes.link
    });
    Routes.link = null;
    return proxy.on('error', function(err, req, res) {
      return winston.log('error', err);
    });
  }).listen(80, function() {
    return winston.log('info', "Server started... ###################");
  });

  http.createServer(function(req, res) {
    res.writeHead(418, {
      'Content-Type': 'text/html'
    });
    res.write("Quelque chose me dit que vous ne savez pas ce que vous faites ici, aller je suis gentil <a href=\"http://rcdinfo.fr\">cliquez la</a>.");
    return res.end();
  }).listen(9000);

}).call(this);
