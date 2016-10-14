let Db = require('./db');
let Log = require('./logger');
let Route = require('./models/route');
/**
 * @Class Router
 */
module.exports = class Router {

  constructor() {
    /* let route = new (db.models.Route)();
    route.active = true;
    route.subDomain= "sub2";
    route.destPort= 8081;
    route.destHost= "127.0.0.1";
    route.save();*/

    // An array of Route model
    this.routes = [];
    this.updateRoutes();
  }

  updateRoutes() {
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

  addRoute(obj) {
    let tmp = new Route(obj);
    this.routes.push(tmp);
    Log.debug(tmp.toObject());
  }
  removeRoute(){

  }
};
