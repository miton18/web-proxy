
let Db = require('./db');
let Log = require('./logger');
let Router = require('./router');
let Reporter = require('./reporter');

Log.info('Proxy is starting...');

Reporter.recordMetric('order/orderAmount', 412);
Reporter.recordMetric('order/orderAmount', 413);


let router = new Router();


process.on('uncaughtException', function(err) {
  Log.error(err.message, {from: 'uncaughtException'});
});
process.on('unhandledRejection', function(reason, promise) {
  Log.error(reason, {from: 'uncaughtException'});
  Log.debug(promise);
});
