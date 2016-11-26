const os = require('os');
const log = require('./logger');
const cluster = require('cluster');

/**
 * Reporter is a Trace singleton
 *
 * @class Reporter
 */
class Reporter {

  /**
   * Creates an instance of Reporter.
   * 
   * @constructor
   * @memberOf Reporter
   */
  constructor() {
    if (process.env.PROXY_TRACE_KEY === undefined) {
      log.warn('No Trace reporter is defined, set PROXY_TRACE_KEY env var to enable it');
      this.active = false;
    }
    else {
      this.nodeName = '';
      if (cluster.isMaster) this.nodeName = 'master'
      else if (cluster.isWorker) this.nodeName = cluster.worker.id
      else this.nodeName = 'unknow'

      let name = `proxy-${os.hostname()}-${this.nodeName}`;
      process.env.TRACE_SERVICE_NAME = name;
      process.env.TRACE_API_KEY = process.env.PROXY_TRACE_KEY;

      this.trace = require('@risingstack/trace');

      /* this.trace.report('order/orderAmount', {test: true});
      this.trace.incrementMetric('order/gpu');
      this.trace.recordMetric('order/orderAmountaaa', 412); */

      log.info('Trace reporter enabled, his name is : ' + name);
      this.active = true;
    }
  }

  /**
   * Take a Trace metric, add 1 and store it
   * 
   * @param {String} Metric name
   * 
   * @memberOf Reporter
   */
  incrementMetric(m) {
    if (this.active) this.trace.incrementMetric(m);
  }

  /**
   * return an instance of Singleton
   * 
   * @static
   * @return {Reporter}
   * 
   * @memberOf Reporter
   */
  static getInstance() {
    if (!(Reporter.instance instanceof Reporter)) 
      Reporter.instance = new Reporter();
    return Reporter.instance;
  }

}
module.exports = Reporter.getInstance();
