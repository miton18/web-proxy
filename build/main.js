(function() {
  var Routes, domain, http, httpProxy, proxy, winston;

  http = require('http');

  httpProxy = require('http-proxy');

  winston = require('winston');

  Routes = require("./routes.json");

  domain = 'rcdinfo.fr';

  proxy = httpProxy.createProxyServer({});

  winston.add(winston.transports.File, {
    filename: 'test.log'
  });

  http.createServer(function(req, res) {
    var err, error, fn, hostname, i, len, route;
    hostname = req.headers.host.split(":")[0];
    winston.log('info', "Request on " + hostname);
    fn = (function(_this) {
      return function(route) {
        if ((route.sdom + "." + domain) === hostname) {
          return Routes.link = "http://localhost:" + route.port;

          /*try
              proxy.web req, res,
                  target: "http://localhost:#{route.port}"
          winston.log 'info', "-> http://localhost:#{route.port}"
          catch error
              winston.log 'error', "routage #{error}"
           */
        }
      };
    })(this);
    for (i = 0, len = Routes.length; i < len; i++) {
      route = Routes[i];
      fn(route);
    }
    winston.log('info', "link: " + link);
    if (Routes.link == null) {
      Routes.link = "http://localhost:9000";
      winston.log('error', "no route for: " + hostname);
    }
    try {
      proxy.web(req, res, {
        target: Routes.link
      });
      return winston.info("-> " + Routes.link);
    } catch (error) {
      err = error;
      return winston.log('error', err);
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
  }).listen(9000);

}).call(this);
