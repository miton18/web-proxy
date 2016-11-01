
let http = require('http');
let bodyParser = require('body-parser');
let Log = require('./logger');
let Api = require('./api');
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
