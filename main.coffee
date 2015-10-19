http        = require 'http'
httpProxy   = require 'http-proxy'

Routes      = require "./routes.json"

domain      = 'rcdinfo.fr'
routes      = {}
routed      = false
proxy       = httpProxy.createProxyServer({})


http.createServer (req, res)->
    hostname = req.headers.host.split(":")[0]

    console.log "Request on #{hostname}"

    for route in Routes
        do (route)->
            if "#{route.sdom}.#{domain}" == hostname

                routed = true
                proxy.web req, res,
                    target: "http://#{domain}:#{route.port}"
                console.log "-> http://#{domain}:#{route.port}"

    unless routed then proxy.web req, res,
                    target: "http://localhost:9999"


.listen 80, ->
    console.log 'Server started...'

# SSL Proxy
###
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



###
# USED FOR TEST
http.createServer (req, res)->
    res.writeHead 200,
        'Content-Type': 'text/plain'
    res.write "proxy default: #{req.url} \n #{JSON.stringify(req.headers, true, 2)}"
    res.end()
.listen(9999)
###
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

###
