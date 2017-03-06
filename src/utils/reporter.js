// ----------------------------------------------------------------------------
const os      = require('os');
const cluster = require('cluster');
const fetch = require('node-fetch');
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
      // this.trace = require('@risingstack/trace');
      Log.debug(`REPORTER IS DISABLED BY FORCE`);
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
   * get the trace api key
   * @return {String} the trace api key
   */
  get traceApiKey() {
    let key = process.env.PROXY_TRACE_KEY || null;
    if (key === null) {
      Log.warn('No Trace reporter is defined, ' +
        ' set PROXY_TRACE_KEY env var to enable it');
    }

    return key;
  }

  /**
   * get the trace service name
   * @return {String} the trace service name
   */
  get traceServiceName() {
    let name = '';
    if (cluster.isMaster) {
      name = 'master';
    } else if (cluster.isWorker) {
      name = 'worker';
    } else {
      name = 'unknow';
    }
    return (
      `Proxy-${os.hostname()}:${name}`
    );
  }

  /**
   * format a string to send to warp10 instance
   * @param {string} name the name of the metric
   * @param {Object} labels the name of labels
   * @param {any} value the value of the metric
   * @param {number?} latitude the latitude
   * @param {longitude?} longitude the longitude
   * @param {elevation?} elevation the elevation
   * @return {string} a beautiful string to send
   */
  toWarp10Format(name, labels, value, latitude, longitude, elevation) {
    elevation = elevation || '';
    let position = '';

    if (latitude && longitude) {
      position = `${latitude}:${longitude}`;
    }

    if (typeof value === 'string') {
      value = `'${value}'`;
    }

    labels = labels.map((label) => `${label.key}=${label.value}`);
    return `
      ${this.getMicroSeconds()}/${position}/${elevation} ${name}{${labels.join(',')}} ${value}
    `;
  }

  /**
   * Send metrics to Warp10
   * @param {Array} metrics Array or string of metric to send
   */
  sendWarp10Metric(metrics) {
    if (!process.env.PROXY_WARP10_URI || !process.env.PROXY_WARP10_WRITE_TOKEN) {
      return;
    }
    if(Array.isArray(metrics)) {
      metrics = metrics.join('\n');
    }
    Log.silly('Warp10 metric', metrics);

    fetch(`${process.env.PROXY_WARP10_URI}/api/v0/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Warp10-Token': process.env.PROXY_WARP10_WRITE_TOKEN
      },
      body: metrics
    })
    .then((res) => {
      if (res.status === 200) {
        return Log.debug('warp10 metric sent');
      }
      Log.error('[reporter] fail to store Warp10 metric', res.body);
    })
    .catch((err) => {
      Log.error('[reporter] fail to send Warp10 metric', err);
      console.log(err);
    });
  }

  /**
   * @param {string} name Metric name
   * @param {Object} labels the name of labels
   * @param {any} value the value of the metric
   * @param {number?} latitude the latitude
   * @param {longitude?} longitude the longitude
   * @param {elevation?} elevation the elevation
   */
  simpleMetric(name, labels, value, latitude, longitude, elevation) {
    const l = this.toWarp10Format(name, labels, value, latitude, longitude, elevation);
    this.sendWarp10Metric(l);
  }

  /**
   * Get the current Timestamp in microsecond
   * @return {number} Timestamp in microsecond
   */
  getMicroSeconds() {
    return (new Date().getTime()) * 1e3;
  }
}

// ----------------------------------------------------------------------------
// exports
module.exports = Reporter.getInstance();
