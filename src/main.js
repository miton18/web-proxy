
let http        = require('http');
//let http2 = require('spdy');
let bodyParser  = require('body-parser');
let Log         = require('./logger');
let Api         = require('./api');
let Router      = require('./router');
let Reporter    = require('./reporter');
let init        = require('./init');

Log.info('Proxy is starting...');
Reporter.incrementMetric('action.start');

let e = process.env;
if (    e['PROXY_DB']   == undefined 
    ||  e['PROXY_KEY']  == undefined 
    ||  e['PROXY_SALT'] == undefined ) {
      console.error('Missing at least one env var : PROXY_DB PROXY_KEY PROXY_SALT');
      process.exit();
}

init();

/*http.createServer({}
, Router.getProxyApp())
.listen(443);*/
http.createServer(Router.getProxyApp())
.listen(80, () => {
  Log.info('Proxy HTTP started');
});

Api.listen(8080, () => {
  Log.info('api started');
});



process.on('uncaughtException', err => {
  Log.error(err.message, err
  );
  Reporter.incrementMetric('error.uncaught');
});

process.on('unhandledRejection', (reason, promise) => {
  Log.error(reason, {
    from: 'uncaughtException',
    promise: promise
  });
  Reporter.incrementMetric('error.rejection');
  Log.debug(promise);
});
