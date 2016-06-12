
db      = require './db'
mongo   = require 'mongodb'

module.exports = class Route

    constructor: ({@_id=null, @subDomain='', @destPort=-1, @destHost='localhost', @active=true, @forwardSSL=false}) ->
        console.log "new #{@toString()}"
        if @_id?
            @_id = new mongo.ObjectID @_id

    save: (cb)=>
        console.log "save Route #{@_id}"
        db (err, db)=>
            if err?
                return console.log err
            db.collection 'route'
            .save @
            , (err, r)->
                cb err, r

    delete: (cb)=>
        db (err, db)=>
            if err?
                return console.log err
            console.log "delete Route #{@_id}"
            db.collection 'route'
            .deleteOne
                #subDomain: 'domain5'
                _id: @_id
            , (err, r)->
                cb err, r

    toString: =>
        return "Route #{@_id} ( #{@subDomain}, #{@destPort}, #{@destHost} ) " + \
               if @active       then 'active'   else 'inactive' + \
               if @forwardSSL   then 'SSL'      else ''
    getLink: =>
        ssl = if @forwardSSL then 's' else ''
        return "http#{ssl}://#{@destHost}:#{@destPort}"