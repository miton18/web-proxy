http        = require 'http'
https       = require 'https'
fs          = require 'fs'
express     = require 'express'
bodyParser  = require 'body-parser'
Router      = require './router.js'
Route       = require './route.js'
Logger      = require './logger'

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
    Logger.log 'info', "Server started http ... "

#------------------------------------------------------------------------
# https support
###https.createServer certs, router.getApp()
.listen 443, ->
    winston.log 'info', "Server started https ... "
###

#------------------------------------------------------------------------
# GUI Server

# API for webserver
api = express.Router()
# WebServer
gui = express()
gui.use bodyParser()
gui.use '/', express.static 'public'
gui.use '/api', api

api.route '/routes'
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

