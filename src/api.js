let express = require('express');
let Router = require('./router');


let apiRouter = express.Router();
apiRouter.get('/200', (req, res) => {
  res.status(200).json({err: null, message: "It's fine !"});
});
apiRouter.get('/check', (req, res) => {
});


apiRouter.route('/route')
.get((req, res) => {
  console.log('coucou');
  res.json(Router.routes);
  console.log('coucou');
});




// Auth middleware
apiRouter.all('/*', (req, res, next) => {
});

module.exports = apiRouter;
