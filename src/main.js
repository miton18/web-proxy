// ----------------------------------------------------------------------------
// vscode hack
if (process.execArgv[1]) {
  process.execArgv[1] = process.execArgv[1].replace('-brk', '');
}

// ----------------------------------------------------------------------------
// requirements
require('./utils/config').load();
const cluster     = require('cluster');
const os          = require('os');
const v8          = require('v8');
const init        = require('./init');
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
  // --------------------------------------------------------------------------
  // environements
  Joi.validate(process.env, EnvSchema, {allowUnknown: true}, (error) => {
    // ------------------------------------------------------------------------
    // error
    if (error) {
      logger.error(error.message);

      process.exit(1);
    }
    process.on('SIGINT', () => {
      reporter.simpleMetric('proxy.action', [], 'stop');
      process.exit(1);
    });

    // ------------------------------------------------------------------------
    // reporter
    reporter.simpleMetric('proxy.action', [], 'start');

    // ------------------------------------------------------------------------
    // create workers
    cluster.schedulingPolicy = cluster.SCHED_RR;
    cluster.setupMaster({
      silent: false
    });

    for (let i = 0, n = os.cpus().length - 1; i < n; ++i) {
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

    // ------------------------------------------------------------------------
    // Create first user etc...
    init();

    let heap = {};
    setInterval(() => {
      heap = v8.getHeapStatistics();
      reporter.simpleMetric('proxy.v8.heap', [], heap.total_heap_size);
      reporter.simpleMetric('proxy.v8.heap.executable', [], heap.total_heap_size_executable);
      reporter.simpleMetric('proxy.v8.heap.limit', [], heap.heap_size_limit);
      reporter.simpleMetric('proxy.v8.heap.used', [], heap.used_heap_size);
      reporter.simpleMetric('proxy.v8.physical', [], heap.total_physical_size);
      reporter.simpleMetric('proxy.v8.available', [], heap.total_available_size);
      reporter.simpleMetric('proxy.v8.memory.malloced', [], heap.malloced_memory);
      reporter.simpleMetric('proxy.v8.memory.malloced.peak', [], heap.peak_malloced_memory );
      // reporter.simpleMetric('proxy.heap.', [], heap.does_zap_garbage );
    }, 10000);
  });

// ----------------------------------------------------------------------------
// worker
} else {
  // --------------------------------------------------------------------------
  // variables
  require('./worker');
}
