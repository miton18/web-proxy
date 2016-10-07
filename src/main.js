
let db = require('./db');
let log = require('./logger');

log.debug('DEBUG');
log.error('ERROR');

process.on('uncaughtException', function(err) {
  log.error(err.message);
});
process.on('unhandledRejection', function(reason, promise) {
  log.error(reason);
  log.debug(promise);
});
