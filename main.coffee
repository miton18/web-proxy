http        = require 'http'
httpProxy   = require 'http-proxy'
winston     = require 'winston'

Routes      = require "./routes.json"

domain      = 'rcdinfo.fr'
proxy       = httpProxy.createProxyServer({})

winston.add winston.transports.File,
    filename: 'test.log'

http.createServer (req, res)->
    hostname = req.headers.host.split(":")[0]

    winston.log 'info', "Request on #{hostname}"

    for route in Routes
        do (route)=>
            if "#{route.sdom}.#{domain}" == hostname

                Routes.link = "http://localhost:#{route.port}"
                ###try
                    proxy.web req, res,
                        target: "http://localhost:#{route.port}"
                winston.log 'info', "-> http://localhost:#{route.port}"
                catch error
                    winston.log 'error', "routage #{error}"
                ###
    winston.log 'info', "link: #{Routes.link}"
    unless Routes.link?
        Routes.link =  "http://localhost:9000"
        winston.log 'error', "no route for: #{hostname}"

    proxy.web req, res,
        target: Routes.link
    winston.info "-> #{Routes.link}"
    Routes.link = null;

    proxy.on 'error', (err, req, res)->
        winston.log 'error', err

.listen 80, ->
    winston.log 'info', "Server started... ###################"

http.createServer (req, res)->

    res.writeHead 418,
            'Content-Type': 'text/html'
        res.write "Quelque chose me dit que vous ne savez pas ce que vous faites ici, aller je suis gentil <a href=\"http://rcdinfo.fr\">cliquez la</a>."
        res.end()

.listen(9000)
