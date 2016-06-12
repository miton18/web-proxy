

winston = require 'winston'
require('winston-mongodb').MongoDB;

Logger = new winston.Logger
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.MongoDB)(
            db : process.env['PROXY-DB'],
            collection: 'log'
        )
    ]

module.exports = Logger