// ----------------------------------------------------------------------------
// requirement
const winston = require('winston');
const Mongo = require('winston-mongodb').MongoDB;
const db = require('./database');

// miton I HATE THIS WAY TO DO; EXPORT YOUR MODULE; YOU SHOULD NOT ATTACH IT !
require('winston-ovh');

// ----------------------------------------------------------------------------
/**
 * class Logger
 */
class Logger extends winston.Logger {

  /**
   * get an instance of logger
   * @return {Logger} the logger instance
   */
  static getInstance() {
    if (!(Logger.instance instanceof Logger)) {
      Logger.instance = new Logger();

      Logger.instance.add(winston.transports.Console, {
        name: 'console',
        level: 'debug',
        colorize: true,
        prettyPrint: true
      });

      Logger.instance.add(Mongo, {
        name: 'mongo',
        level: 'info',
        db: db.uri,
        collection: 'Log',
        storeHost: false,
        tryReconnect: true,
        decolorize: true
      });

      if (process.env.WINSTON_OVH_CREDENTIAL) {
        Logger.instance.add(Winston.transports.ovh, {
          token: process.env.WINSTON_OVH_CREDENTIAL
        });
      }
    }

    return Logger.instance;
  }

}

// ----------------------------------------------------------------------------
// exports
module.exports = Logger.getInstance();
