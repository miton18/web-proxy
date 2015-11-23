http        = require 'http'
httpProxy   = require 'http-proxy'
winston     = require 'winston'

Routes      = require "./routes.json"

domain      = 'rcdinfo.fr' # Domaine a surveiller
proxy       = httpProxy.createProxyServer({})

winston.add winston.transports.File,
    filename: 'access.log' # fichier de log

http.createServer (req, res)->

    if req.headers?.host?

        hostname = req.headers.host.split(":")[0]
    else
        hostname = ''



    winston.log 'info', "Request on #{hostname}"

    for route in Routes
        do (route)=>
            if "#{route.sdom}.#{domain}" == hostname

                Routes.link = "http://localhost:#{route.port}"

    unless Routes.link?
        Routes.link =  "http://localhost:9000"
        winston.log 'error', "no route for: #{hostname}"

    proxy.web req, res,
        target: Routes.link
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
