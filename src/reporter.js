// ----------------------------------------------------------------------------
/**
 * class Reporter
 */
class Reporter {

  /**
   * constructor
   */
  constructor() {
    this.active = false;

    if (this.traceApiKey && this.traceServiceName) {
      this.active = true;
      this.trace = require('@risingstack/trace');
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
    return (
      process.env.TRACE_API_KEY ||
      null
    );
  }

  /**
   * get the trace service name
   * @return {String} the trace service name
   */
  get traceServiceName() {
    return (
      process.env.TRACE_SERVICE_NAME ||
      null
    );
  }
}

// ----------------------------------------------------------------------------
// exports
module.exports = Reporter.getInstance();
