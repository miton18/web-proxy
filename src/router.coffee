
httpProxy   = require 'http-proxy'
Route       = require './route'
Logger      = require './logger'
db          = require './db'

module.exports = class Router

    routes: []

    constructor: (@host, @defaultURL) ->
        @proxy = httpProxy.createProxyServer({})

    loadRoutes: =>
        tmp = []
        db (err, db)=>
            if err?
                return console.log err
            db.collection 'route'
            .find
                active: true
            .toArray (err, routes)=>
                if err?
                    return Logger.log 'error', 'no connexion with Mongo client',
                        error: err
                for r in routes
                    tmp.push (new Route r)
                # Default route for manager
                tmp.push new Route
                    subDomain: 'webproxy'
                    destPort:   9999
                    destHost:   '127.0.0.1'
                    active:     true
                    forwardSSL: false
                @routes = tmp

    getRoutes: =>
        return @routes

    getAllRoutes: (cb)=>
        db (err, db)=>
            if err?
                return console.log err
            db.collection 'route'
            .find()
            .toArray (err, routes)=>
                cb err, routes

    getApp: (req, res) =>
        reqHostname = if req?.headers?.host? then req.headers.host.split(":")[0] else null

        for route in @routes
            do (route)=>
                if route.subDomain + '.' + @host == reqHostname
                    @link = route.getLink()

        unless @link?
            @link = @defaultURL
            Logger.log 'error', 'no route for subdomain',
                'requested': reqHostname

        @proxy.web req, res,
            target: @link

        @link = null
        @proxy.on 'error', (err, req, res)->
            Logger.log 'error', 'proxy error',
                error: err
            res.writeHead 500,
                'Content-Type': 'text/plain'
            res.end '500: Internal Server Error'