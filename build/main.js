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
    var err, error, fn, hostname, i, len, link, route;
    hostname = req.headers.host.split(":")[0];
    winston.log('info', "Request on " + hostname);
    fn = function(route) {
      var link;
      if ((route.sdom + "." + domain) === hostname) {
        return link = "http://localhost:" + route.port;

        /*try
            proxy.web req, res,
                target: "http://localhost:#{route.port}"
        winston.log 'info', "-> http://localhost:#{route.port}"
        catch error
            winston.log 'error', "routage #{error}"
         */
      }
    };
    for (i = 0, len = Routes.length; i < len; i++) {
      route = Routes[i];
      fn(route);
    }
    if (typeof link === "undefined" || link === null) {
      link = "http://localhost:9000";
      winston.log('error', "no route for: " + hostname);
    }
    try {
      proxy.web(req, res, {
        target: link
      });
      return winston.info("-> " + link);
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
