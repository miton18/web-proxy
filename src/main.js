// ----------------------------------------------------------------------------
// vscode hack
if (process.execArgv[1])
  process.execArgv[1] = process.execArgv[1].replace('-brk', '');

// ----------------------------------------------------------------------------
// requirements
const cluster   = require('cluster');
const reporter  = require('./utils/reporter');
const logger    = require('./utils/logger');

// ----------------------------------------------------------------------------
// master
if (cluster.isMaster) {
  const os = require('os');
  const init = require('./init');

  // --------------------------------------------------------------------------
  // environements
  if (!process.env.PROXY_JWT_SECRET) {
    logger.error('[bootstrap] PROXY_JWT_SECRET variable environement is not set');

    process.exit(1);
  } else {
    logger.info('[bootstrap] JWT secret loaded');
  }

  if (!process.env.PROXY_MONGODB_ADDON_URI &&
      (
        !process.env.PROXY_MONGODB_ADDON_USER &&
        !process.env.PROXY_MONGODB_ADDON_PASSWORD &&
        !process.env.PROXY_MONGODB_ADDON_DB &&
        !process.env.PROXY_MONGODB_ADDON_HOST &&
        !process.env.PROXY_MONGODB_ADDON_PORT
      )
    ) {
    logger.error('[bootstrap] Please set environements variables to connect mongodb');

    process.exit(1);
  } else {
    logger.info('[bootstrap] MongoDB parameters loadeds');
  }

  // --------------------------------------------------------------------------
  // reporter
  reporter.incrementMetric('action.start');

  // --------------------------------------------------------------------------
  // create workers
  cluster.schedulingPolicy = cluster.SCHED_RR;
  cluster.setupMaster({
    silent: false
  });

  for (let i = 0, n = os.cpus().length; i < n; ++i) {
    cluster
    .fork()
    .addListener('exit', (code, signal) => {
      Log.warn(`[main] Worker exited, start new one`, {code, signal});
      reporter.incrementMetric('worker.died', 1);
      cluster.fork();
    });
  }

  cluster.addListener('online', (worker) => {
    logger.info(`[main] Worker ${worker.process.pid} is online`);
  });

  cluster.addListener('exit', (worker, code, signal) => {
    logger.error(`[main] Master ${worker.process.pid} died`);
    reporter.incrementMetric('master.died', 1);
  });

  // -------------------------------------------------------------------------
  // Create first user etc...
  init();
}

// ----------------------------------------------------------------------------
// worker
else {
  // --------------------------------------------------------------------------
  // variables
  const worker = require('./worker');
}
