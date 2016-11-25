let os = require('os');
let log = require('./logger');
let cluster = require('cluster');

/**
 * Reporter is a Trace singleton
 *
 * @class Reporter
 */
class Reporter {
  constructor() {
    if (process.env.PROXY_TRACE_KEY === undefined) {
      log.warn('No Trace reporter is defined, set PROXY_TRACE_KEY env var to enable it');
      this.active = false;
    }
    else {
      let nodeName = '';
      if (cluster.isMaster) nodeName = 'master'
      else if (cluster.isWorker) nodeName = cluster.worker.id
      else nodeName = 'unknow'

      let name = `proxy-${os.hostname()}-${nodeName}`;
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
  incrementMetric(m) {
    if (this.active) this.trace.incrementMetric(m);
  }

  static getInstance() {
    if (!Reporter.instance) {
      Reporter.instance = new Reporter();
    }
    return Reporter.instance;
  }

}
module.exports = Reporter.getInstance();
