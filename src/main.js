
let express = require('express');
let http = require('http');
let bodyParser = require('body-parser');
let Log = require('./logger');
let Router = require('./router');
let Reporter = require('./reporter');

Log.info('Proxy is starting...');
Reporter.incrementMetric('action.start');

/*let api = express();
api.use(bodyParser.json());
api.use('/api', require('./api'));
api.listen(8080, () => {
  Log.info('API started...');
});*/

http.createServer(Router.getProxyApp(), 80, () => {
  Log.info('Proxy started on port 80');
});

process.on('uncaughtException', function(err) {
  Log.error(err.message, {from: 'uncaughtException'});
  Reporter.incrementMetric('error.uncaught');
});
process.on('unhandledRejection', function(reason, promise) {
  Log.error(reason, {from: 'uncaughtException'});
  Reporter.incrementMetric('error.rejection');
  Log.debug(promise);
});
