(function() {
  var Routes, domain, http, httpProxy, proxy, routed, routes;

  http = require('http');

  httpProxy = require('http-proxy');

  Routes = require("./routes.json");

  domain = 'rcdinfo.fr';

  routes = {};

  routed = false;

  proxy = httpProxy.createProxyServer({});

  http.createServer(function(req, res) {
    var fn, hostname, i, len, route;
    hostname = req.headers.host.split(":")[0];
    console.log("Request on " + hostname);
    fn = function(route) {
      if ((route.sdom + "." + domain) === hostname) {
        routed = true;
        proxy.web(req, res, {
          target: "http://localhost:" + route.port
        });
        return console.log("-> http://localhost:" + route.port);
      }
    };
    for (i = 0, len = Routes.length; i < len; i++) {
      route = Routes[i];
      fn(route);
    }
    if (!routed) {
      res.writeHead(418, {
        'Content-Type': 'text/plain'
      });
      res.write("Quelque chose me dit que vous ne savez pas ce que vous faites içi, aller je suis gentil <a href=\"http://rcdinfo.fr\">cliquez</a> là ");
      return res.end();
    }
  }).listen(80, function() {
    return console.log('Server started...');
  });


  /*
  http.createServer (req, res)->
      hostname = req.headers.host.split(":")[0]

      console.log "Request on #{hostname}"

      for route in Routes
          do (route)->
              if "#{route.sdom}.#{domain}" == hostname

                  proxy.web req, res,
                      target: "http://localhost:#{route.ssl}"
  .listen 443, ->
      console.log 'Server started...'

  http.createServer (req, res)->
      console.log req.url
      res.writeHead 200,
          'Content-Type': 'text/plain'
      res.write "proxy 2: #{req.url} \n #{JSON.stringify(req.headers, true, 2)}"
      res.end()
  .listen(8002)

  http.createServer (req, res)->
      console.log req.url
      res.writeHead 200,
          'Content-Type': 'text/plain'
      res.write "proxy3: #{req.url} \n #{JSON.stringify(req.headers, true, 2)}"
      res.end()
  .listen(8003)
   */

}).call(this);
