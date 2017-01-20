module.exports = {

  /**
   * ENV : PROXY_JWT_SECRET
   * used to encrypt your account passwords
   */
  proxyJwtSecret: '',

  /**
   * ENV : PROXY_JWT_ISSUER
   * JWT "creator" use your domain name
   */
  proxyJwtIssuer: '',

  /**
   * ENV : PROXY_JWT_AUDIENCE
   * JWT "target" a group for example
   */
  proxyJwtAudience: '',

  /**
   * ENV : PROXY_MONGODB_ADDON_URI
   * The complete uri for connection
   * Ex: mongodb://user:password@host:port/database
   * If you this one, don't fill other addons confs
   */
  proxyMongodbAddonUri: '',

  /**
   * ENV : PROXY_MONGODB_ADDON_USER
   * Your MongoDB connection user
   */
  proxyMongodbAddonUser: '',

  /**
   * ENV : PROXY_MONGODB_ADDON_PASSWORD
   * Your MongoDB connection password
   */
  proxyMongodbAddonPassword: '',

  /**
   * ENV : PROXY_MONGODB_ADDON_DB
   * Your MongoDB connection database
   */
  proxyMongodbAddonDb: '',

  /**
   * ENV : PROXY_MONGODB_ADDON_HOST
   * Your MongoDB connection address
   */
  proxyMongodbAddonHost: '',

  /**
   * ENV : PROXY_MONGODB_ADDON_PORT
   * Your MongoDB connection port
   */
  proxyMongodbAddonPort: '',

  /**
   * ENV : PROXY_PEPPER
   * Used to enhance user's password
   * Don't loose it !
   */
  proxyPepper: '',

  /**
   * ENV : PROXY_WARP10_WRITE_TOKEN
   * A write token from Warp10 platform
   * Used to send monitoring metrics
   */
  proxyWarp10WriteToken: '',

  /**
   * ENV : PROXY_WARP10_URI
   * Warp10 Egress endpoint
   * Used for monitoring
   */
  proxyWarp10Uri: '',

  /**
   * ENV : PROXY_DOCKER_SOCKET
   * Url or socket to dial with Docker API
   */
  proxyDockerSocket: ''
};
