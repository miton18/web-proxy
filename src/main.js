// ----------------------------------------------------------------------------
// vscode hack
if (process.execArgv[1])
  process.execArgv[1] = process.execArgv[1].replace('-brk', '');

// ----------------------------------------------------------------------------
// requirements
const cluster     = require('cluster');
const reporter    = require('./utils/reporter');
const logger      = require('./utils/logger');
const Joi         = require('joi');
const {EnvSchema} = require('./models/env');
const idToPid     = new Map();

// ----------------------------------------------------------------------------
// master
if (cluster.isMaster) {
  const os    = require('os');
  const init  = require('./init');

  // --------------------------------------------------------------------------
  // environements
  Joi.validate(process.env, EnvSchema, {allowUnknown: true}, (error) => {
    // --------------------------------------------------------------------------
    // error
    if (error) {
      logger.error(error.message);

      process.exit(1);
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
  });

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
