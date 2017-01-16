// ----------------------------------------------------------------------------
// vscode hack
if (process.execArgv[1]) {
  process.execArgv[1] = process.execArgv[1].replace('-brk', '');
}

// ----------------------------------------------------------------------------
// requirements
const cluster     = require('cluster');
const reporter    = require('./utils/reporter');
const logger      = require('./utils/logger');
const Joi         = require('joi');
const {EnvSchema} = require('./models/env');

// ----------------------------------------------------------------------------
// this refer to worker
/* eslint no-invalid-this: "off" */
/**
 * When a worker exit we need to reload it
 * @param  {Number} code
 * @param  {String} signal
 */
function workerExitedHandlerfunction(code, signal) {
  logger.warn(`[main] Worker exited, start new one`, {code, signal});
  // reporter.incrementMetric('worker.died', 1);
  reporter.simpleMetric('proxy.worker.dead', [], 1);

  cluster
    .fork()
    .addListener('exit', workerExitedHandlerfunction);
}

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
    reporter.simpleMetric('proxy.action', [], 'start');

    // --------------------------------------------------------------------------
    // create workers
    cluster.schedulingPolicy = cluster.SCHED_RR;
    cluster.setupMaster({
      silent: false
    });

    for (let i = 0, n = os.cpus().length; i < n; ++i) {
      cluster
      .fork()
      .addListener('exit', workerExitedHandlerfunction);
    };

    cluster.addListener('online', (worker) => {
      logger.info(`[main] Worker ${worker.process.pid} is online`);
    });

    cluster.addListener('exit', (worker, code, signal) => {
      logger.error(`[main] Master ${worker.process.pid} died`);
      // reporter.incrementMetric('master.died', 1);
      reporter.simpleMetric('proxy.master.dead', [{
        key: 'code',
        value: code
      }, {
        key: 'signal',
        value: signal
      }], 1);
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
              for(let id in cluster.workers) {
                if(cluster.workers.hasOwnProperty(id)) {
                  cluster.workers[id].send({
                    component: 'Router',
                    action: 'refresh'
                  });
                }
              }

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
