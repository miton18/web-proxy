if (process.execArgv[0] != undefined)
  process.execArgv[0] = process.execArgv[0].replace('-brk', '');

const cluster     = require('cluster'); 
const Log         = require('./utils/logger');
const Reporter    = require('./utils/reporter');

if (cluster.isMaster) {

  let os      = require('os');
  let init    = require('./init');
  let env     = process.env;
  let numCPUs = os.cpus().length;
  // Force round-robin
  cluster.schedulingPolicy = cluster.SCHED_RR;

  Log.info('[bootstrap] Proxy master is starting');
  Reporter.incrementMetric('action.start');

  if (    env['PROXY_DB']   == undefined 
      ||  env['PROXY_JWT_SECRET']  == undefined 
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

  const worker = require('./worker');
  worker.start();
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
