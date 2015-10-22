http        = require 'http'
httpProxy   = require 'http-proxy'
winston     = require 'winston'

Routes      = require "./routes.json"

domain      = 'rcdinfo.fr'
routes      = {}
routed      = false
proxy       = httpProxy.createProxyServer({})

winston.add winston.transports.File,
    filename: 'test.log'

http.createServer (req, res)->
    hostname = req.headers.host.split(":")[0]

    console.log "Request on #{hostname}"

    for route in Routes
        do (route)->
            if "#{route.sdom}.#{domain}" == hostname

                routed = true
                proxy.web req, res,
                    target: "http://localhost:#{route.port}"
                winston.log 'info', "-> http://localhost:#{route.port}"

    unless routed
        proxy.web req, res,
            target: "http://localhost:9999"
        winston.log 'error', "not route for: #{hostname}"


.listen 80, ->
    winston.log 'info', "Server started... ###################"

http.createServer (req, res)->

    res.writeHead 418,
            'Content-Type': 'text/html'
        res.write "Quelque chose me dit que vous ne savez pas ce que vous faites ici, aller je suis gentil <a href=\"http://rcdinfo.fr\">cliquez la</a>."
        res.end()

.listen(9999)
