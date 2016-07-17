db      = require './db'
mongo   = require 'mongodb'

module.exports = {

    lastN: (n, cb)=>
        db (err, db)=>
            if err?
                return console.log err
            db.collection 'log'
            .find {}
            .limit n
            .toArray (err, logs)=>
                cb err, logs

    getFrom: (ts, cb)=>
        db (err, db)=>
            if err?
                return console.log err
            db.collection 'log'
            .find
                timestamp:
                    $gte: ts
            .toArray (err, logs)=>
                cb err, logs
    ###
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

    ###
    #toString: =>
    ###return "Route #{@_id} ( #{@subDomain}, #{@destPort}, #{@destHost} ) " + \
            if @active       then 'active'   else 'inactive' + \
                if @forwardSSL   then 'SSL'      else ''
    ###
}