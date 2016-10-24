let Db = require('./db');
let Log = require('./logger');
let Route = require('./models/route');

/**
 * @Class Router
 */
class Router {

  constructor() {
    /* let route = new (db.models.Route)();
    route.active = true;
    route.subDomain= "sub2";
    route.destPort= 8081;
    route.destHost= "127.0.0.1";
    route.save();*/

    // An array of Route model
    this.routes = [];
    // Route.findOneAndRemove({}, err => {});
    // Initialise Routes
    this.loadRoutes();
    setInterval(()=> {
      Route.find({}, routes => {console.log('test');});
    }, 1000);
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
        for (let route of routes) {
          Log.info("Load route : " + route.subDomain, route.toJSON());
          this.routes.push(route);
        }
      }
    });
  }

  // Create a new Route
  addRoute(obj) {
    let tmp = new Route(obj);
    tmp.save(err => {
      if (err) {
        Log.error('Failed to save new Route : ' + tmp.subDomain, obj);
      } else {
        this.routes.push(tmp);
        Log.debug("OK add new Route", tmp.toObject());
      }
    });
  }

  removeRoute(obj) {
    if (obj._id === undefined) {
      Log.warn("Can't delete, no _id field", obj);
    } else {
      Route.findOneAndRemove(obj, err => {
        if (err) {
          Log.error("Failed to remove this Route", obj);
        } else {
          Log.debug("Route deleted", obj);
        }
      });
    }
  }

  // HTTP Request handle to proxy response
  getProxyApp() {
    return (req, res) => {
      console.log(req);
    };
  }
}

module.exports = Router.getInstance();
