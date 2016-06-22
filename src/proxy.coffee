http        = require 'http'
https       = require 'https'
fs          = require 'fs'
express     = require 'express'
eSession    = require 'express-session'
bodyParser  = require 'body-parser'
sha512      = require 'sha512'
crypto      = require 'crypto'
Router      = require './router.js'
Route       = require './route.js'
Logger      = require './logger'

#process.env['TRACE_SERVICE_NAME'] = 'web-proxi'
#process.env['TRACE_API_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3NjI0NmNkZjk2YWU2YjAwMDNmZTM0ZCIsImlhdCI6MTQ2NjA1ODQ0NX0.wGnBWNnk5hp6nymJ6_oPaOsyqIhNmvkarDhs3KWvyTQ'

#require     '@risingstack/trace'

#------------------------------------------------------------------------
# SSL
###certs =
     key: fs.readFileSync '/etc/letsencrypt/live/rcdinfo.fr/privkey.pem'
     cert: fs.readFileSync '/etc/letsencrypt/live/rcdinfo.fr/cert.pem'
###
#------------------------------------------------------------------------
# main App
router = new Router 'local.dev', 'http://remi.rcdinfo.fr/'
router.loadRoutes()

#------------------------------------------------------------------------
# http support
http.createServer router.getApp
.listen 80, ->
    Logger.log 'info', "Server started http"

#------------------------------------------------------------------------
# https support
###https.createServer certs, router.getApp()
.listen 443, ->
    winston.log 'info', "Server started https ... "
###

#------------------------------------------------------------------------
# GUI Server

# WebServer
gui = express()
gui.use bodyParser.json()
gui.use bodyParser.urlencoded({ extended: true })
gui.use '/public', express.static __dirname + '/public'
gui.use eSession
    resave: false
    saveUninitialized: true
    secret: process.env['PROXY-SALT']
    cookie:
        expires: new Date Date.now() + 3600000
        maxAge: 3600000

needAuth = (req, res, next)->
    if req.session?.connected?
        next()
    else
        res.json
            err: 'need to be connected'

gui.post '/login', (req, res) ->
    unless req.body?.password?
        res.json
            err: 'need a password to auth'
    else
        if sha512(req.body.password + process.env['PROXY-SALT']).toString('hex') == process.env['PROXY-PW']
            req.session.connected = true
            res.json
                err: null
        else
            setTimeout ->
                res.json
                    err: 'Bad password'
            , 2000

gui.get '/logout', (req, res) ->
    req.session.destroy (err)->
        res.json
            err: if err? then err else null

gui.post '/getnewpass', (req, res)->
    unless req.body?.password?
        res.json
            err: 'no password'
    else
        crypto.randomBytes 20, (ex, buf) ->
            salt = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-')
            res.json
                err: null
                proxySalt:  salt
                proxyPw:    sha512(req.body.password + salt ).toString('hex')

# API for webserver
api = express.Router()
gui.use '/api', api

api.route '/routes'
# You need to be logged to use API
.all needAuth
.get (req, res) ->
    router.getAllRoutes (err, routes) ->
        if err?
            return Logger.log 'error', 'no connexion with Mongo client',
                error: err
        res.json routes

.post (req, res)->
    unless req.body?.subDomain? && req.body?.destPort?
        return res.json
            err: 'bad parameters'
    tmpRoute = new Route req.body
    tmpRoute.save (err, result) ->
        return res.json
            err: err
            # row inserted
            result: JSON.parse(result).n == 1
            route: tmpRoute

api.route '/routes/:_id'
.all needAuth
.put (req, res) ->
    req.body['_id'] = req.params._id
    tmpRoute = new Route req.body
    tmpRoute.save ( err, result ) ->
        res.json
            err: err
            # number row modified
            result: JSON.parse(result).nModified == 1
            route: tmpRoute

.delete (req, res)->
    tmp = new Route req.params
    tmp.delete (err, result)->
        res.json
            err: err
            # number row deleted
            result: JSON.parse(result).n == 1

gui.listen 9999, ->
    console.log 'GUI started'

