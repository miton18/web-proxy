let winston = require('winston');
let db = require('./db');
let winstonMongo = require('winston-mongodb').MongoDB;

// Trace require
// TRACE_SERVICE_NAME
// TRACE_API_KEY
/* trace.report('metricName', {
    field: Value
  })
  trace.recordMetric('order/orderAmount', 412)
  process.env.TRACE_SERVICE_NAME = conf.traceName;
  process.env.TRACE_API_KEY = conf.traceKey;
  this.trace = require('@risingstack/trace');
  */

/**
 * This class need a valid DB connexion
 * levels: error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 
 * @class Logger
 */
class Logger {

  constructor(uri = null) {
    this.winston = new (winston.Logger)();

    // Console Transport
    this.winston.add(winston.transports.Console);
    this.winston.transports.console.level = 'debug';

    // Mongo Transport
    this.winston.add(winstonMongo, {
      level: 'info',
      db: (uri === null) ? process.env.PROXY_DB : uri,
      collection: 'log',
      // Store hostname, for multiple instances
      storeHost: false,
      tryReconnect: true,
      decolorize: true
    });
  }
  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}
module.exports = Logger.getInstance().winston;
