
let db = require('./db.js');

db.models.route.find((err, routes) => {
  console.log(routes);
});

