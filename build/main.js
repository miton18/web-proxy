(function() {
  var Routes, app, certs, domain, fs, http, httpProxy, https, proxy, winston;

  http = require('http');

  https = require('https');

  httpProxy = require('http-proxy');

  winston = require('winston');

  https = require('https');

  fs = require('fs');

  Routes = require("./routes.json");

  domain = 'rcdinfo.fr';

  proxy = httpProxy.createProxyServer({});

  certs = {
    key: fs.readFileSync('/etc/letsencrypt/live/rcdinfo.fr/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/rcdinfo.fr/cert.pem')
  };

  winston.add(winston.transports.File, {
    filename: 'access.log'
  });

  app = function(req, res) {
    var fn, hostname, i, len, ref, route;
    if (((ref = req.headers) != null ? ref.host : void 0) != null) {
      hostname = req.headers.host.split(":")[0];
    } else {
      hostname = '';
    }
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
  };

  http.createServer(app).listen(80, function() {
    return winston.log('info', "Server started... ###################");
  });

  https.createServer(certs, app).listen(443);

  http.createServer(function(req, res) {
    res.writeHead(418, {
      'Content-Type': 'text/html'
    });
    res.write("Quelque chose me dit que vous ne savez pas ce que vous faites ici, aller je suis gentil <a href=\"http://rcdinfo.fr\">cliquez la</a>.");
    return res.end();
  }).listen(9000);

}).call(this);
