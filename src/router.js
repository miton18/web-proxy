// ----------------------------------------------------------------------------
// requirements
const Proxy = require('http-proxy');
const http = require('http');
const logger = require('./utils/logger');
const Db = require('./utils/database');
const cluster = require('cluster');
const {warp10} = require('./middlewares/warp10');

// ----------------------------------------------------------------------------
/**
 * class Router
 */
class Router {

  /**
   * constructor
   */
  constructor() {
    this.mapToRoute = new Map(); // domainName => []routePath = Route
    this.mapRoutes = new Map();  // route ID to route
    this.mapDomains = new Map();  // domain ID to Domain
    this.proxy = Proxy.createProxyServer({
      ws: true,
      secure: false,
      proxyTimeout: 500
    });

    process.on('message', (msg) => {
      if (msg.component == 'Router') {
        switch (msg.action) {
          case 'refresh':
            this.loadRoutes().then(() => {
              logger.info('[router] Router update his routes');
            }).catch((err) => {
              logger.error('[router] Router fail to update his routes', error);
            });
            break;
        }
      }
    });
  }

  /**
   * get instance singleton
   * @return {Router} the router instance
   */
  static getInstance() {
    if (!(Router.instance instanceof Router)) {
      Router.instance = new Router();
    }

    return Router.instance;
  }

  /**
   * Initialize function that is trigger at start
   * @return {Promise<Object>} when the router is on
   */
  initialize() {
    return new Promise((resolve, reject) => {
      this.loadRoutes()
      .then(
        ()=> {
          let server = http.createServer(Router.handleRoute);

          server.on('request', warp10);

          server.listen(process.env.PROXY_PORT || 80, () => {
            logger.info(`[router] Proxy listen at ${process.env.PROXY_PORT || 80}`);

            resolve();
          });
        })
        .catch((err) => {
          logger.error(`[router] Fail to load initial routes`);
          reject();
        });
    });
  }

  /**
   * add all DB routes in router instance
   * @return {Promise<Object>} resolve when routes loaded
   */
  loadRoutes() {
    return new Promise((resolve) => {
      this.mapToRoute.clear();
      this.mapRoutes.clear();
      this.mapDomains.clear();

      Db.models.Route
      .find()
      .populate('domain')
      .exec((err, routes) => {
        if (err) {
          return reject(err);
        }

        for (let route of routes) {
          if (route.active && route.domain) {
            if (!this.mapToRoute.has(route.domain.name)) {
              this.mapToRoute.set(route.domain.name, new Map());
            }

            this.mapToRoute.get(route.domain.name).set(route.path, route.toObject());
          }

          this.mapRoutes.set(route._id.toString(), route);
        }

        Db.models.Domain.find({}, (err, domains) => {
          if (err) {
            return reject(err);
          }

          for (let domain of domains) {
            this.mapDomains.set(domain._id, domain);
          }

          resolve();
        });
      });
    });
  }

  /**
   * implement routes simple array
   * @return {Array<Route>} all Router routes
   */
  get routes() {
    let res = [];
    for(let route of this.mapRoutes.values()) {
      res.push(route);
    }

    return res;
  }

  /**
   * implement routes simple array
   * @return {Array<Route>} all Router routes
   */
  get domains() {
    let res = [];
    for(let dom of this.mapDomains.values()) {
      res.push(dom);
    }

    return res;
  }

  /**
   * Notify others workers to update their routes
   */
  notifyWorkers() {
    logger.info('emit to cluster');
    cluster.worker.send({
      component: 'Router',
      action: 'refresh'
    });
  }

  /**
   * find a route by id
   * @param {ObjectId} _id the id
   * @return {RouteModel} the route
   */
  findRouteById(_id) {
    return this.mapRoutes.get(_id);
  }

  /**
   * find routes by destination host
   * @param {String} domain the host
   * @param {String} path the host
   * @return {RouteModel} routes
   */
  findRouteByHost(domain, path) {
    return this.mapToRoute.get(domain).get(path);
  }

  /**
   * find routes by request domain
   * @param {String} reqDomain the complete host from HTTP header
   * @return {RouteModel} routes
   */
  findActiveRouteByDomain(reqDomain) {
    if(/(\d{1,3}.){3}\d{1}/g.test(reqDomain)) { // request by IP, no routes....
      return null;
    }

    let s = reqDomain.match(/\w+/g);
    let domain = `${s[s.length - 2]}.${s[s.length - 1]}`;
    let path = (s[s.length - 3])? s[s.length - 3] : null;
    logger.debug('request domain / path', domain, path);
    if (this.mapToRoute.has(domain)) {
      return this.mapToRoute.get(domain).get(path);
    }

    return null;
  }

  /**
   * add a route
   * @param {RouteSchema} schema the schema
   * @return {Promise<RouteModel>} the result
   */
  addRoute(schema) {
    return new Promise((resolve, reject) => {
      let route = new Db.models.Route(schema);

      route.save((error) => {
        if (error) {
          return reject(error);
        }
        resolve(route);
        this.notifyWorkers();
      });
    });
  }

  /**
   * remove a route
   * @param {RouteModel} route the route to remove
   * @return {Promise<Object>} when the operation is finished
   */
  removeRoute(route) {
    return new Promise((resolve, reject) => {
      route.remove((err) => {
        if (err) {
          return reject(err);
        }

        resolve();
        this.notifyWorkers();
      });
    });
  }

  /**
   * edit a route
   * @param {RouteModel} route the route to edit
   * @return {Promise<Object>} when the operation is finished
   */
  updateRoute(route) {
    return new Promise((resolve, reject) => {
      if (!route._id) {
        return resolve(this.addRoute(route));
      }

      route.save((error) => {
        if (error) {
          return reject(error);
        }
        resolve(route);
        this.notifyWorkers();
      });
    });
  }

  /**
   * handle a route
   * @param {any} request the request
   * @param {any} response the response
   * @return {void}
   */
  static handleRoute(request, response) {
    const _router = Router.getInstance();
    const host = request.headers.host;
    const route = _router.findActiveRouteByDomain(host);

    if (!route) {
      response.writeHead(404);
      return response.end();
    }

    let protocol = 'http';
    if (route.ssl) {
      protocol = 'https';
    }

    let target = `${protocol}://${route.host}:${route.port}`;
    _router.proxy.web(request, response, {target}, (error) => {
      if (error) {
        response.writeHead(500);
        return response.end();
      }
    });
  }
}

// ----------------------------------------------------------------------------
// exports
module.exports = Router.getInstance();
