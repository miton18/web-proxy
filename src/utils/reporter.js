// ----------------------------------------------------------------------------
const os      = require('os');
const cluster = require('cluster');
const Log     = require('./logger');
/**
 * class Reporter
 */
class Reporter {

  /**
   * constructor
   */
  constructor() {
    this.active = false;

    if (this.traceApiKey) {
      this.active = true;
      process.env.TRACE_SERVICE_NAME = this.traceServiceName;
      process.env.TRACE_API_KEY      = this.traceApiKey;
      this.trace = require('@risingstack/trace');

      Log.debug(`Reporter enabled, name : ${this.traceServiceName}`);
    }
  }

  /**
   * return a reporter instance
   * @return {Reporter} the reporter instance
   */
  static getInstance() {
    if(!(Reporter.instance instanceof Reporter)) {
      Reporter.instance = new Reporter();
    }

    return Reporter.instance;
  }

  /**
   * increment the trace metric
   * @param {String} name the name of the the metric
   * @param {Number} amount coefficient
   */
  incrementMetric(name, amount) {
    if (this.active) {
      this.trace.incrementMetric(name, amount);
    }
  }

  /**
   * get the trace api key
   * @return {String} the trace api key
   */
  get traceApiKey() {
    let key = process.env.PROXY_TRACE_KEY || null;
    if (key === null) Log.warn('No Trace reporter is defined, set PROXY_TRACE_KEY env var to enable it');
    return key
  }

  /**
   * get the trace service name
   * @return {String} the trace service name
   */
  get traceServiceName() {
    let name = ''
    if (cluster.isMaster) name = 'master'
    else if (cluster.isWorker) name = cluster.worker.id
    else name = 'unknow'
    return (
      `Proxy-${os.hostname()}:${name}`
    );
  }
}

// ----------------------------------------------------------------------------
// exports
module.exports = Reporter.getInstance();
