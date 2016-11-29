// ----------------------------------------------------------------------------
// vscode hack
if (process.execArgv.lenght) {
  process.execArgv[0] = process.execArgv[0].replace('-brk', '');
}

// ----------------------------------------------------------------------------
// requirements
const cluster = require('cluster');
const reporter = require('./reporter');
const logger = require('./logger');
const os = require('os');

// ----------------------------------------------------------------------------
// environements
if (!process.env.PROXY_JWT_SECRET) {
  logger.error('[bootstrap] PROXY_JWT_SECRET variable environement is not set');

  process.exit(1);
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
}

// ----------------------------------------------------------------------------
// master
if (cluster.isMaster) {
  const init = require('./init');
  init();
  // --------------------------------------------------------------------------
  // reporter
  reporter.incrementMetric('action.start');

  // --------------------------------------------------------------------------
  // variables
  const workers = [];

  // --------------------------------------------------------------------------
  // create workers
  cluster.schedulingPolicy = cluster.SCHED_RR;
  cluster.addListener('online', (worker) => {
    logger.info(`Worker ${worker.process.pid} is online`);
  });

  cluster.addListener('exit', (worker, code, signal) => {
    logger.warn(`Master ${worker.process.pid} died`);
  });

  for (let i = 0, n = os.cpus().length; i < n; ++i) {
    workers.push(cluster.fork()
    .addListener('exit', (code, signal) => {
      cluster.fork();
    }));
  }
}

// ----------------------------------------------------------------------------
// worker
if (cluster.isWorker) {
  console.log(cluster.isWorker);
  // --------------------------------------------------------------------------
  // variables
  const worker = require('./worker');
  // --------------------------------------------------------------------------
  // start the worker
  worker.start();
}
