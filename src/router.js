// ----------------------------------------------------------------------------
// requirements
const Proxy = require('http-proxy');
const http = require('http');
const logger = require('./logger');
const db = require('./database');

// ----------------------------------------------------------------------------
/**
 * class Router
 */
class Router {

  /**
   * constructor
   */
  constructor() {
    this.routes = [];
    this.proxy = Proxy.createProxyServer({
      ws: true,
      secure: false,
      proxyTimeout: 300
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
      db.models.Route.find({}, (error, routes) => {
        if (error) {
          reject(error);
        }

        this.routes = routes;
        logger.info(`Load ${routes.length} routes`);

        http
          .createServer(this.handleRoute)
          .listen(process.env.PROXY_PORT || 80, () => {
            logger.info(`Proxy listen at ${process.env.PROXY_PORT || 80}`);

            resolve();
          });
      });
    });
  }

  /**
   * find a route by id
   * @param {ObjectId} _id the id
   * @return {RouteModel} the route
   */
  findRouteById(_id) {
    for (const route of this.routes) {
      if (route._id === _id) {
        return route;
      }
    }

    return null;
  }

  /**
   * find routes by destination host
   * @param {String} host the host
   * @return {RouteModel} routes
   */
  findRouteByHost(host) {
    for (const route of this.routes) {
      if (route.host === host) {
        return route;
      }
    }

    return null;
  }

  /**
   * find routes by request domain
   * @param {String} domain the host
   * @return {RouteModel} routes
   */
  findRouteByDomain(domain) {
    for (const route of this.routes) {
      if (route.domain === domain) {
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
      let route = new db.modelsRoute(schema);

      route.save((error) => {
        if (error) {
          return reject(error);
        }

        this.routes.push(route);

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
      this.routes = this.routes.filter((item) => item._id !== route._id);
      route.remove((error) => {
        if (error) {
          return reject(error);
        }

        resolve();
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
      if (!this.findRouteById(route._id)) {
        return this
          .addRoute(route)
          .then(resolve)
          .catch(reject);
      }

      const {_id} = route;
      db.models.Route.update({_id}, route, (error, route) => {
        if (error) {
          return reject(error);
        }

        this.routes = this.routes.map((item) => {
          if (item._id === route._id) {
            return route;
          }

          return item;
        });

        resolve(route);
      });
    });
  }

  /**
   * handle a route
   * @param {any} request the request
   * @param {any} response the response
   * @return {void}
   */
  handleRoute(request, response) {
    const host = request.headers.host;
    const route = this.findRouteByDomain(host);

    if (!route) {
      return response
        .status(404)
        .end();
    }

    let protocol = 'http';
    if (route.ssl) {
      protocol = 'https';
    }

    let target = `${protocol}://${route.host}:${route.port}`;
    this.proxy.web(request, response, {target}, (error) => {
      if (error) {
        return response
          .status(500)
          .end();
      }
    });
  }
}

// ----------------------------------------------------------------------------
// exports
module.exports = Router.getInstance();
