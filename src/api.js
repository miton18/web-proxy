const express     = require('express');
const compression = require('compression');
const bodyParser  = require('body-parser');
const jwt         = require('jwt-simple');
const Router      = require('./router');
const Log         = require('./utils/logger');
const Db          = require('./utils/database');
const protected   = require('./utils/auth');

const app = express();
const api = express.Router();

/*************************** 
 * USES
***************************/
app.use('/api', api);
app.use(compression());
api.use(compression());
app.use(bodyParser.json());
api.use(bodyParser.json());

/*************************** 
 * Params
***************************/

/*************************** 
 * Routes
***************************/ 
app.get('/200', (req, res) => {
  res.status(200).json({err: null, message: "It's fine !"});
});

api.get('/check', (req, res) => {
  res.json({});
});

api.use('/route', require('./controller/route'));
api.use('/log',   require('./controller/log'));
api.use('/token', require('./controller/token'));
api.use('/user',  require('./controller/user'));


module.exports = app;
