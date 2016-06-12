
mongo = require('mongodb').MongoClient

module.exports = (cb)->
    mongo.connect process.env['PROXY-DB'], (err, db)->
        cb err, db