
const Path = require('path');
const configPaths = [
  '/etc/web-proxy/config.js',
  '/usr/share/web-proxy/config.js',
  // project path
  `${__dirname}/../../config.js`
];

/**
 * return string in environement variable format
 * from camelCase string
 * @param {string} str CamelCase string
 * @return {string} formatted string
 */
function unCamelize(str) {
  return str.split(/(?=[A-Z])/).join('_').toUpperCase();
}

/**
 * This is a function to parse json configuration
 * and format it in ENV vars format.
 * It check for configurations in defined paths.
 */
function load() {
  let conf = {};

  for( let path of configPaths) {
    try {
      conf = require(Path.resolve(path));
    } catch(e) {
      continue;
    }
    console.info(`Found config file, use ${Path.resolve(path)}`);
    break;
  }

  if(!conf) {
    return;
  }

  for(let param in conf) {
    if(conf[param] && !process.env[unCamelize(param)]) {
      process.env[unCamelize(param)] = conf[param];
    }
  }
};

// ----------------------------------------------------------------------------
// exports
module.exports = {
  load
};
