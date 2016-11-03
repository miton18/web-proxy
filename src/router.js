let Db = require('./db');
let Log = require('./logger');

/**
 * @Class Router
 */
class Router {

  constructor() {
    /*let route = new (Db.models.Route)();
    route.active = true;
    route.subDomain = "sub2";
    route.destPort = 8081;
    route.destHost = "127.0.0.1";
    route.save();*/
    /*let proxyRoute = new (Db.models.Route)();
    proxyRoute.active = true;
    proxyRoute.subDomain = "proxy";
    proxyRoute.destPort = 8080;
    proxyRoute.destHost = "127.0.0.1";
    proxyRoute.save();*/

    // An array of Route model
    this.routes = [];
    // Initialise Routes
    this.loadRoutes();
  }

  // Singleton
  static getInstance() {
    if (!Router.instance) {
      Router.instance = new Router();
    }
    return Router.instance;
  }

  // Load Routes from Mongo database
  loadRoutes() {
    Db.models.Route.find(null, (err, routes) => {
      if (err) {
        Log.error(err);
      } else {
        this.routes = routes;
      }
    });
  }

  // Create a new Route Return a Promise
  addRoute(obj) {
    return new Promise((resolve, reject) => {
      let tmp = new (Db.models.Route)(obj);
      tmp.save(err => {
        if (err) {
          Log.error('Failed to save new Route : ' + tmp.subDomain, obj);
          reject(err);
        } 
        else {
          this.routes.push(tmp);
          Log.debug("OK add new Route", tmp.toObject());
          resolve(tmp);
          this.loadRoutes();
        }
      });
    });
  }

  removeRoute(route) {
    return new Promise((resolve, reject) => {
      route.remove(err => {
          if (err) {
            Log.error("Fail to remove this Route", route.toObject());
            reject(err);
          } else {
            Log.debug("Route deleted", route.toObject());
            resolve(route);
            this.loadRoutes();
          }
        });
      });
  }

  editRoute(route) {
    return new Promise((resolve, reject) => { 
      route.save((err) => {
        if (err) {
          Log.error('Fail to update route', route.toObject());
          reject(err);
        } else {
          resolve(route);
        }
      });
    });
  }

  // HTTP Request handle to proxy response
  getProxyApp() {
    return (req, res) => {
      console.log(req);
    };
  }

  findRouteById(id) {
    for (let route of this.routes) {
      if (route._id.toHexString() === id) return route;
    }
    return null;
  }
}

module.exports = Router.getInstance();
