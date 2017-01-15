// ----------------------------------------------------------------------------
// requirements
const Dockerode = require('dockerode');

// ----------------------------------------------------------------------------
// exports
module.exports = {
  connection: new Dockerode({
    socketPath: process.env.PROXY_DOCKER_SOCKET
  })
};
