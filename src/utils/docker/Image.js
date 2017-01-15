// ----------------------------------------------------------------------------
// requirements
const {connection} = require('./DockerConnection');
const logger = require('../logger');
const async = require('async');

// ----------------------------------------------------------------------------
// class

/**
 * class Image
 */
class Image {

  /**
   * constructor
   * @param {string} identifier the image identifier
   */
  constructor(identifier) {
    this.identifier = identifier;
  }

  /**
   * list image
   * @return {Promise<Image[]>} promise with the list of available image
   */
  static list() {
    return new Promise((resolve, reject) => {
      connection.listImages({}, (error, images) => {
        if (error) {
          logger.error(error.message);

          return reject(error);
        }

        resolve(images.map((image) => new Image(image.Id)));
      });
    });
  }

  /**
   * pull an image
   * @param {string} name the name of the image with the tag
   * @return {Promise<Image>} Promise with the image
   */
  static pull(name) {
    return new Promise((resolve, reject) => {
      connection.pull(name, (error, stream) => {
        if (error) {
          logger.error(error.message);

          return reject(error);
        }

        connection.modem.followProgress(stream, (error, outputs) => {
          if (error) {
            logger.error(error.message);

            return reject(error);
          }

          resolve(Image.exists(name));
        }, (event) => {
          let log;
          if (event.status === 'Downloading' || event.status === 'Extracting') {
            const {current, total} = event.progressDetail;

            log = `${event.status} - ${event.id} - ${current / total * 100}%`;
          } else if (event.id) {
            log = `${event.status} - ${event.id}`;
          } else {
            log = `${event.status}`;
          }

          logger.silly(log);
        });
      });
    });
  }

  /**
   * get image if exists
   * @param {string} name the image name with tag
   * @return {Promise<Image>} the image
   */
  static exists(name) {
    return new Promise((resolve, reject) => {
      Image.list().catch(reject).then((images) => {
        async.reduce(images, null, (state, image, done) => {
          image.information().then((information) => {
            if (information.RepoTags.indexOf(name) !== -1) {
              state = image;
            }


            done(null, state);
          }).catch(done);
        }, (error, image) => {
          if (error) {
            logger.error(error.message);

            return reject(error);
          }

          resolve(image);
        });
      });
    });
  }

  /**
   * get information
   * @return {Promise<any>} raw information about the image
   */
  information() {
    return new Promise((resolve, reject) => {
      connection.getImage(this.identifier).inspect((error, information) => {
        if (error) {
          logger.error(error.message);

          return reject(error);
        }

        resolve(information);
      });
    });
  }

  /**
   * remove an image
   * @return {Promise<Image>} resolve that is trigger when image has removed
   */
  remove() {
    return new Promise((resolve, reject) => {
      connection.getImage(this.identifier).remove((error) => {
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
  Image
};
