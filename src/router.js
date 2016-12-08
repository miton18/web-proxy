// ----------------------------------------------------------------------------
// requirements
const Proxy = require('http-proxy');
const http = require('http');
const logger = require('./utils/logger');
const Db = require('./utils/database');

// ----------------------------------------------------------------------------
/**
 * class Router
 */
class Router {

  /**
   * constructor
   */
  constructor() {
    this.mapRoutesID = new Map();
    this.mapRoutesDomain = new Map();
    this.proxy = Proxy.createProxyServer({
      ws: true,
      secure: false,
      proxyTimeout: 500
    });
  }

  /**
   * get instance singleton
   * @return {Router} the router instance
   */
  static getInstance() {
    if (!(Router.instance instanceof Router))
      Router.instance = new Router();
    return Router.instance;
  }

  /**
   * Initialize function that is trigger at start
   * @return {Promise<Object>} when the router is on
   */
  initialize() {
    return new Promise((resolve, reject) => {
      Db.models.Route.find({active: true}, (error, routes) => {
        if (error) {
          return reject(error);
        }
        for (let route of routes) {
          this.mapRoutesID.set(route._id.toString(), route);
          this.mapRoutesDomain.set(route.domain, route);
        }
        logger.info(`Load ${routes.length} routes`);

        http
          .createServer(Router.handleRoute)
          .listen(process.env.PROXY_PORT || 80, () => {
            logger.info(`Proxy listen at ${process.env.PROXY_PORT || 80}`);

            resolve();
          });
      });
    });
  }

  get routes() {
    let res = [];
    for(let [k, route] of this.mapRoutesID)
      res.push(route);
    return res;
  }

  /**
   * find a route by id
   * @param {ObjectId} _id the id
   * @return {RouteModel} the route
   */
  findRouteById(_id) {
    return this.mapRoutesID.get(_id);
  }

  /**
   * find routes by destination host
   * @param {String} host the host
   * @return {RouteModel} routes
   */
  findRouteByHost(host) {
    for(let route of this.routes) {
      if(route.host === host)
        return route;
    }
    return undefined;
  }

  /**
   * find routes by request domain
   * @param {String} domain the host
   * @return {RouteModel} routes
   */
  findRouteByDomain(reqDomain) {
    for (const [domain, route] of this.mapRoutesDomain) {
      if (domain.includes(reqDomain)) {
        return route;
      }
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

        this.mapRoutesDomain.set(route.domain, route);
        this.mapRoutesID.set(route._id.toString(), route);

        resolve(route);
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
        if (err) return reject(err);
        this.mapRoutesDomain.delete(route.domain);
        this.mapRoutesID.delete(route._id.toString());
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
        return resolve(this
          .addRoute(route)
          .then(resolve)
          .catch(reject));
      }

      route.update((error) => {
        if (error) {
          return reject(error);
        }

        this.mapRoutesID.set(route._id.toString(), route);
        this.mapRoutesDomain.set(route.domain, route);
        return resolve(route);
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
    const route = _router.findRouteByDomain(host);

    if (!route) {
      response.writeHead(404)
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
