http        = require 'http'
https       = require 'https'
httpProxy   = require 'http-proxy'
winston     = require 'winston'
https       = require 'https'
fs          = require 'fs'

Routes      = require "./routes.json"

domain      = 'rcdinfo.fr' # Domaine a surveiller
proxy       = httpProxy.createProxyServer({})

certs =
     key: fs.readFileSync '/etc/letsencrypt/live/rcdinfo.fr/privkey.pem'
     cert: fs.readFileSync '/etc/letsencrypt/live/rcdinfo.fr/cert.pem'

winston.add winston.transports.File,
    filename: 'log/access.log' # fichier de log







app = (req, res)->

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

    Routes.link = null

    proxy.on 'error', (err, req, res)->
        winston.log 'error', err







http.createServer app
.listen 80, ->
    winston.log 'info', "Server started... ###################"

https.createServer certs, app
.listen 443





# troll quand pas de routes connues
http.createServer (req, res)->

    res.writeHead 418,
            'Content-Type': 'text/html'
        res.write "Quelque chose me dit que vous ne savez pas ce que vous faites ici, aller je suis gentil <a href=\"https://remi.rcdinfo.fr\">cliquez la</a>."
        res.end()

.listen(9000)
