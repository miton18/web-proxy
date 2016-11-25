if (process.execArgv[0] != undefined)
  process.execArgv[0] = process.execArgv[0].replace('-brk', '');

const cluster     = require('cluster'); 
const Log         = require('./logger');
const Reporter    = require('./reporter');

if (cluster.isMaster) {

  let os      = require('os');
  let init    = require('./init');
  let env     = process.env;
  let numCPUs = os.cpus().length;
  // Force round-robin
  cluster.schedulingPolicy = cluster.SCHED_NONE;

  Log.info('[bootstrap] Proxy master is starting');
  Reporter.incrementMetric('action.start');

  if (    env['PROXY_DB']   == undefined 
      ||  env['PROXY_KEY']  == undefined 
      ||  env['PROXY_SALT'] == undefined ) {
        console.error('[bootstrap] Missing at least one env var : PROXY_DB PROXY_KEY PROXY_SALT');
        process.exit();
  }

  // Do some stuff like create first user
  init();
  
  for (let i = 0; i < numCPUs; i++) {
    let t = cluster.fork();
    t.on('exit', function(code, signal) {
      this. 
      cluster.fork();
    });
    Log.debug(`[bootstrap] worker ${t.process.pid} is lunched`);
  }

  cluster.on('exit', (worker, code, signal) => {
    Log.warn(`Master ${worker.process.pid} died`);
  });
  cluster.on('online', (worker) => {
    Log.info('Worker ' + worker.process.pid + ' is online');
  });
}
/**
 * Workers code
 */
if (cluster.worker) {

  let http        = require('http');
  //let http2 = require('spdy');
  let bodyParser  = require('body-parser');
  let Api         = require('./api');
  let Router      = require('./router');

  http.createServer(Router.getProxyApp())
  .listen(80, () => {
    //Log.info('Proxy HTTP started');
  });

  Api.listen(8080, () => {
    //Log.info('api started');
  });
}

/**
 * Events on all process Master & workers
 */
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
