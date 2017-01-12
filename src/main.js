// ----------------------------------------------------------------------------
// vscode hack
if (process.execArgv[1])
  process.execArgv[1] = process.execArgv[1].replace('-brk', '');

// ----------------------------------------------------------------------------
// requirements
const cluster   = require('cluster');
const reporter  = require('./utils/reporter');
const logger    = require('./utils/logger');
idToPid         = new Map();
// ----------------------------------------------------------------------------
// master
if (cluster.isMaster) {
  const os    = require('os');
  const init  = require('./init');

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

  if (!process.env.PROXY_PEPPER) {
    logger.error(`[bootstrap] PROXY_PEPPER environement variable is not set`);
    process.exit(1);
  } else
    logger.info(`[bootstrap] App pepper loaded, ready for cook`);

  if (!process.env.PROXY_JWT_ISSUER || ! process.env.PROXY_JWT_AUDIENCE) {
    logger.error(`[bootstrap] PROXY_JWT_ISSUER or PROXY_JWT_AUDIENCE
      environement variable is not set`);
    process.exit(1);
  }

  if (!process.env.PROXY_WARP10_URI || !process.env.PROXY_WARP10_WRITE_TOKEN) {
    logger.error('All warp10 environement variables are not set');
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
    let tmp = cluster
    .fork({
      WORKER_NUMBER: i+1
    })
    .addListener('exit', workerExitedHandlerfunction);
    // Keep a map of process ID and worker number
    idToPid.set(tmp.process.pid, i+1);
  };

  cluster.addListener('online', (worker) => {
    logger.info(`[main] Worker ${worker.process.pid} is online`);
  });

  cluster.addListener('exit', (worker, code, signal) => {
    logger.error(`[main] Master ${worker.process.pid} died`);
    reporter.incrementMetric('master.died', 1);
  });

  /**
   * double switch for workers-master events
   */
  cluster.on('message', (worker, msg) => {
    logger.debug('message from worker', msg);
    switch (msg.component) {
      case 'Router':
        switch (msg.action) {
          case 'refresh':
            for(let id in cluster.workers)
              if(cluster.workers.hasOwnProperty(id))
                cluster.workers[id].send({
                  component: 'Router',
                  action: 'refresh'
                });
            break;
        };
        break;
    };
  });

  // -------------------------------------------------------------------------
  // Create first user etc...
  init();

// ----------------------------------------------------------------------------
// worker
} else {
  // --------------------------------------------------------------------------
  // variables
  require('./worker');
}

// this refer to worker
/* eslint no-invalid-this: "off" */
/**
 * When a worker exit we need to reload it
 * @param  {Number} code
 * @param  {String} signal
 */
function workerExitedHandlerfunction(code, signal) {
  logger.warn(`[main] Worker exited, start new one`, {code, signal});
  reporter.incrementMetric('worker.died', 1);
  // get process worker ID
  const id = idToPid.get(this.process.pid);

  let tmp = cluster.fork({
    WORKER_NUMBER: id
  }).addListener('exit', workerExitedHandlerfunction);
  idToPid.delete(this.process.pid);
  idToPid.set(tmp.process.pid, id);
}
