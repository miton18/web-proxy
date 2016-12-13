// ----------------------------------------------------------------------------
// requirement
const winston = require('winston');
const cluster = require('cluster');
const Mongo   = require('winston-mongodb').MongoDB;
const db      = require('./database');

// miton I HATE THIS WAY TO DO; EXPORT YOUR MODULE; YOU SHOULD NOT ATTACH IT !
require('winston-ovh');

// ----------------------------------------------------------------------------
/**
 * class Logger
 */
class Logger extends winston.Logger {


  /**
   * Creates an instance of Logger.
   *
   *
   * @memberOf Logger
   */
  constructor() {
    super();
    this.name = (cluster.isMaster)? 'master' : `worker-${cluster.worker.id}`;

    // -----------------------------------------------------------------------
    // Log to console all level without silly
    this.add(winston.transports.Console, {
      name: 'console',
      level: 'silly',
      colorize: true,
      prettyPrint: true
    });

    // -----------------------------------------------------------------------
    // Log to MongoDB from error to info
    this.add(Mongo, {
      name: 'mongo',
      level: 'info',
      db: db.uri,
      collection: 'logs',
      storeHost: false,
      tryReconnect: true,
      decolorize: true,
      capped: true,
      // Keep sync with log model
      cappedSize: 400000000, // In bytes (400M)
      cappedMax: 1000000  // max 1000000 (documents)
    });

    if (process.env.PROXY_WINSTON_OVH_CREDENTIAL) {
      this.add(Winston.transports.ovh, {
        token: process.env.PROXY_WINSTON_OVH_CREDENTIAL
      });
    }

    // -----------------------------------------------------------------------
    // Used to rewrite log message, must return a message
    this.filters =   [
      (level, msg, meta) => {
        return `[${this.name}] ${msg}`;
      }
    ];

    // -----------------------------------------------------------------------
    // Used to edit meta, must the return metas
    this.rewriters = [
      (level, msg, meta) => {
        if (level === 'error' || level === 'warn')
          meta.pid = process.pid;
        return meta;
      }
    ];
  }

  /**
   * get an instance of logger
   * @return {Logger} the logger instance
   */
  static getInstance() {
    if (!(Logger.instance instanceof Logger))
      Logger.instance = new Logger();
    return Logger.instance;
  }
}

// ----------------------------------------------------------------------------
// exports
module.exports = Logger.getInstance();
