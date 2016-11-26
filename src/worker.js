let http        = require('http');
//let http2 = require('spdy');
let bodyParser  = require('body-parser');
let Api         = require('./api');
let Router      = require('./router');

/**
 * 
 * 
 * @class Worker
 */
class Worker {

  /**
   * Creates an instance of Worker.
   * 
   * @constructor
   * @memberOf Worker
   */
  constructor() {
    this.apiPort = process.env.PROXY_API_PORT || 8080;
  }
  
  /**
   * 
   * @memberOf Worker
   */
  start() {
    this.proxyServer = http.createServer(Router.getProxyApp())
    .listen(80, () => {
      //Log.info('Proxy HTTP started');
    });

    this.apiServer = Api.listen(8080, () => {
      //Log.info('api started');
    });
  }

  /**
   * 
   * @return {Promise} when app is stopped
   * @memberOf Worker
   */
  stopApi() {
    return new Promise( (resolve, reject) => {
      this.apiServer.stop(() => {
        resolve();
      });
    });
  }

  /**
   * 
   * 
   * @return {Promise} when app is stopped
   * 
   * @memberOf Worker
   */
  stopProxy() {
    return new Promise( (resolve, reject) => {
      this.proxyServer.stop(() => {
        resolve();
      });
    });
  }

  /**
   * 
   * 
   * @return {Promise} When 2 app has stopped
   * 
   * @memberOf Worker
   */
  stopAll() {
    return new Promise((resolve, reject) => {
      this.stopApi().then(() => {
        this.stopProxy().then(() => {
          resolve();
        })
      });
    });
  }

  /**
   * Return an instance of Singleton
   * 
   * @static
   * @returns {Worker}
   * 
   * @memberOf Worker
   */
  static getInstance() {
    if(!(Worker.instance instanceof Worker))
      Worker.instance = new Worker();
    return Worker.instance
  }
}

module.exports = Worker.getInstance(); 
