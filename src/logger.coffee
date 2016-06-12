

winston = require 'winston'
require('winston-mongodb').MongoDB;

Logger = new winston.Logger
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.MongoDB)(
            db : 'mongodb://utupy5dqytlgrff:rqZSX2CH70X3WnjPzppS@bjg5eoxfbh1rr8x-mongodb.services.clever-cloud.com:27017/bjg5eoxfbh1rr8x',
            collection: 'log'
        )
    ]

module.exports = Logger