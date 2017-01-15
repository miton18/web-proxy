// ----------------------------------------------------------------------------
// requirements
const {connection} = require('./DockerConnection');
const {Image} = require('./Image');
const logger = require('../logger');
const {DockerModel} = require('../../models/docker');
const async = require('async');
const Joi = require('joi');

// ----------------------------------------------------------------------------
// class

/**
 * class Docker
 */
class Docker {

  /**
   * constructor
   * @param {string} identifier the identifier of the docker
   */
  constructor(identifier) {
    this.identifier = identifier;
  }

  /**
   * get list of docker
   * @return {Promise<Docker[]>} a list of docker that is manage by the docker daemon
   */
  static list() {
    return new Promise((resolve, reject) => {
      connection.listContainers((error, containers) => {
        if (error) {
          logger.error(error.message);

          return reject(error);
        }

        resolve(containers.map((container) => new Docker(container.Id)));
      });
    });
  }

  /**
   * run a docker
   * @param {any} options options reference at
   *                      https://docs.docker.com/engine/reference/api/docker_remote_api/
   * @return {Promise<Docker>} the docker launched
   */
  static run(options) {
    return new Promise((resolve, reject) => {
      Joi.validate(options, DockerModel, {allowUnknown: false}, (error) => {
        if (error) {
          logger.error(error.message);

          return reject(error);
        }

        /**
         * function to run the container
         */
        function run() {
          connection.createContainer(options, (error, container) => {
            if (error) {
              logger.error(error.message);

              return reject(error);
            }

            container.start((error) => {
              if (error) {
                logger.error(error.message);

                return reject(error);
              }

              resolve(new Docker(container.id));
            });
          });
        }

        Image.exists(options.Image).catch(reject).then((image) => {
          if (!image) {
            return Image.pull(options.Image).then(run);
          }

          run();
        });
      });
    });
  }

  /**
   * get docker if exists
   * @param {string} identifier the docker identifier
   * @return {Promise<Docker>} the docker
   */
  static exists(identifier) {
    return new Promise((resolve, reject) => {
      Docker.list().catch(reject).then((dockers) => {
        async.reduce(dockers, null, (state, docker, done) => {
          if (docker.identifier === identifier) {
            state = docker;
          }

          done(null, state);
        }, (error, docker) => {
          if (error) {
            logger.error(error.message);

            return reject(error);
          }

          resolve(docker);
        });
      });
    });
  }

  /**
   * get raw information about the docker
   * @return {Promise<any>} a promise with docker information
   */
  information() {
    return new Promise((resolve, reject) => {
      connection.getContainer(this.identifier).inspect((error, information) => {
        if (error) {
          logger.error(error.message);

          return reject(error);
        }

        resolve(information);
      });
    });
  }

  /**
   * start the docker
   * @return {Promise<Docker>} trigger when docker has started
   */
  start() {
    return new Promise((resolve, reject) => {
      connection.getContainer(this.identifier).start((error) => {
        if (error) {
          logger.error(error.message);

          return reject(error);
        }

        resolve(this);
      });
    });
  }

  /**
   * stop the docker
   * @return {Promise<Docker>} trigger when docker has stopped
   */
  stop() {
    return new Promise((resolve, reject) => {
      connection.getContainer(this.identifier).stop((error) => {
        if (error) {
          logger.error(error.message);

          return reject(error);
        }

        resolve(this);
      });
    });
  }

  /**
   * remove the docker
   * @return {Promise<Docker>} trigger when docker has removed
   */
  remove() {
    return new Promise((resolve, reject) => {
      connection.getContainer(this.identifier).remove((error, information) => {
        if (error) {
          logger.error(error.message);

          return reject(error);
        }

        resolve(this);
      });
    });
  }
}

// ----------------------------------------------------------------------------
// exports
module.exports = {
  Docker
};
